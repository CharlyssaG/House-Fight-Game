'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { getInitials } from '@/lib/colors'
import '../app/globals.css'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null) // null | 'create' | 'join' | 'random'
  const [anchorName, setAnchorName] = useState('')
  const [anchorDesc, setAnchorDesc] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [joinCode, setJoinCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [randomFighter, setRandomFighter] = useState(null)
  const [generatingRandom, setGeneratingRandom] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      fetchProfile(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.push('/login')
      else { setUser(session.user); fetchProfile(session.user.id) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    setProfile(data)
    setLoading(false)
  }

  async function generateRandom() {
    setGeneratingRandom(true)
    setRandomFighter(null)
    const r = await fetch('/api/random-fighter')
    const f = await r.json()
    setRandomFighter(f)
    setAnchorName(f.name)
    setAnchorDesc(f.desc || '')
    setGeneratingRandom(false)
  }

  async function createRoom() {
    if (!anchorName.trim()) { setError('Enter a fighter name'); return }
    setCreating(true); setError('')
    const r = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostId: user.id, anchorName: anchorName.trim(), anchorDesc: anchorDesc.trim(), isPublic })
    })
    const d = await r.json()
    if (d.error) { setError(d.error); setCreating(false); return }
    router.push(`/room/${d.room.code}`)
  }

  async function joinRoom() {
    if (!joinCode.trim()) { setError('Enter a room code'); return }
    setCreating(true); setError('')
    const r = await fetch('/api/rooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: joinCode.trim().toUpperCase(), playerId: user.id })
    })
    const d = await r.json()
    if (d.error) { setError(d.error); setCreating(false); return }
    router.push(`/room/${joinCode.trim().toUpperCase()}`)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:40,height:40,border:'3px solid #222',borderTopColor:'var(--red)',borderRadius:'50%'}} className="spin"></div></div>

  return (
    <div>
      {/* NAV */}
      <nav className="nav">
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'.06em'}}>The House Fight Game</span>
        <div className="nav-right">
          <button onClick={() => router.push('/leaderboard')} className="btn bg" style={{padding:'5px 12px',fontSize:'.8rem',width:'auto'}}>🏆 Board</button>
          {profile && (
            <div className="avatar-sm" style={{background:profile.avatar_color||'var(--red)',color:'var(--white)'}}
              onClick={() => router.push('/profile')} title={profile.display_name}>
              {getInitials(profile.display_name || 'P')}
            </div>
          )}
        </div>
      </nav>

      <div className="page">
        {/* HERO */}
        {!mode && (
          <div className="fade-in">
            <div style={{textAlign:'center',padding:'2rem 0 1.5rem'}}>
              <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2.5rem,12vw,4rem)',lineHeight:.92,marginBottom:'.75rem'}}>
                The<br /><span style={{color:'var(--red)'}}>House</span><br />Fight Game
              </h1>
              <p style={{fontSize:'.9rem',color:'var(--dim)',marginBottom:'2rem',lineHeight:1.6}}>
                Welcome back, <strong style={{color:'var(--white)'}}>{profile?.display_name}</strong>
              </p>
            </div>

            {/* STATS STRIP */}
            {profile && profile.total_rounds > 0 && (
              <div className="card fade-in" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',textAlign:'center',marginBottom:'1.25rem'}}>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',color:'var(--green)'}}>{profile.total_wins}</div>
                  <div style={{fontSize:'.68rem',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.08em'}}>Wins</div>
                </div>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',color:'var(--white)'}}>{profile.total_rounds > 0 ? Math.round((profile.total_wins/profile.total_rounds)*100) : 0}%</div>
                  <div style={{fontSize:'.68rem',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.08em'}}>Win Rate</div>
                </div>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',color:'var(--yellow)'}}>{profile.biggest_upset_pct || 0}%</div>
                  <div style={{fontSize:'.68rem',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.08em'}}>Best Upset</div>
                </div>
              </div>
            )}

            {/* MODE CARDS */}
            <div style={{display:'grid',gap:'10px',marginBottom:'1rem'}}>
              <button onClick={() => setMode('create')} className="btn br" style={{padding:'1.1rem',fontSize:'1.1rem'}}>
                ⚔️ Create a room
              </button>
              <button onClick={() => setMode('join')} className="btn bg" style={{padding:'1.1rem',fontSize:'1rem'}}>
                🚪 Join a room with code
              </button>
              <button onClick={() => { setMode('random'); generateRandom() }} className="btn bp" style={{padding:'1.1rem',fontSize:'1rem'}}>
                🎲 Random fighter mode
              </button>
            </div>

            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={() => router.push('/leaderboard')} className="btn bg" style={{flex:1,padding:'.65rem',fontSize:'.85rem'}}>🏆 Leaderboard</button>
              <button onClick={() => router.push('/profile')} className="btn bg" style={{flex:1,padding:'.65rem',fontSize:'.85rem'}}>👤 My profile</button>
              <button onClick={signOut} className="btn bg" style={{flex:1,padding:'.65rem',fontSize:'.85rem'}}>Sign out</button>
            </div>
          </div>
        )}

        {/* CREATE ROOM */}
        {mode === 'create' && (
          <div className="fade-in">
            <button onClick={() => setMode(null)} style={{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'.875rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'5px'}}>← Back</button>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.4rem'}}>Create a room</h2>
            <p style={{fontSize:'.875rem',color:'var(--dim)',marginBottom:'1.75rem',lineHeight:1.6}}>Set the anchor fighter. Share the code. Everyone picks a challenger from their own phone.</p>
            <div className="field"><label>Anchor fighter name</label><input type="text" value={anchorName} onChange={e=>setAnchorName(e.target.value)} placeholder="e.g. Darth Vader" maxLength={60} /></div>
            <div className="field"><label>Description (optional)</label><input type="text" value={anchorDesc} onChange={e=>setAnchorDesc(e.target.value)} placeholder="e.g. Sith Lord, Force choke, lightsaber" maxLength={120} /></div>
            <div className="field" style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <input type="checkbox" id="pub" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} style={{width:'auto'}} />
              <label htmlFor="pub" style={{margin:0}}>Show on public lobby</label>
            </div>
            {error && <p style={{color:'var(--red)',fontSize:'.85rem',marginBottom:'1rem'}}>{error}</p>}
            <button onClick={createRoom} disabled={creating} className="btn br">{creating ? 'Creating…' : 'Create room →'}</button>
          </div>
        )}

        {/* JOIN ROOM */}
        {mode === 'join' && (
          <div className="fade-in">
            <button onClick={() => setMode(null)} style={{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'.875rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'5px'}}>← Back</button>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.4rem'}}>Join a room</h2>
            <p style={{fontSize:'.875rem',color:'var(--dim)',marginBottom:'1.75rem'}}>Enter the 6-character code from your host.</p>
            <div className="field"><label>Room code</label><input type="text" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="e.g. FGHT42" maxLength={6} style={{textTransform:'uppercase',letterSpacing:'.15em',fontSize:'1.5rem',textAlign:'center'}} /></div>
            {error && <p style={{color:'var(--red)',fontSize:'.85rem',marginBottom:'1rem'}}>{error}</p>}
            <button onClick={joinRoom} disabled={creating} className="btn br">{creating ? 'Joining…' : 'Join room →'}</button>
          </div>
        )}

        {/* RANDOM MODE */}
        {mode === 'random' && (
          <div className="fade-in">
            <button onClick={() => { setMode(null); setRandomFighter(null) }} style={{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'.875rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'5px'}}>← Back</button>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.4rem'}}>Random fighter mode</h2>
            <p style={{fontSize:'.875rem',color:'var(--dim)',marginBottom:'1.75rem'}}>The AI picks the anchor. Nobody chooses.</p>
            <div className="card" style={{background:'#0e0a1a',border:'2px solid #3b1a7a',textAlign:'center',padding:'1.5rem',marginBottom:'1.25rem'}}>
              {generatingRandom ? (
                <div><div style={{width:36,height:36,border:'3px solid #3b1a7a',borderTopColor:'var(--pl)',borderRadius:'50%',margin:'0 auto 1rem'}} className="spin"></div><p style={{color:'var(--pl)',fontSize:'.85rem'}}>Generating fighter…</p></div>
              ) : randomFighter ? (
                <div>
                  <p style={{fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--pl)',marginBottom:'.4rem'}}>{randomFighter.origin}</p>
                  <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',color:'var(--white)',marginBottom:'.4rem'}}>{randomFighter.name}</p>
                  <p style={{fontSize:'.8rem',color:'var(--dim)'}}>{randomFighter.desc}</p>
                </div>
              ) : null}
            </div>
            {randomFighter && (
              <div style={{display:'flex',gap:'9px'}}>
                <button onClick={generateRandom} className="btn bg" style={{flex:1}}>🎲 Reroll</button>
                <button onClick={() => { setMode('create') }} className="btn bp" style={{flex:2}}>Use this fighter →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

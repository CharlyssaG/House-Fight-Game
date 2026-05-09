'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ini } from '@/lib/colors'
import './globals.css'

const S = { field:'field', card:'card', btn:'btn', page:'page' }

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null)
  const [anchorName, setAnchorName] = useState('')
  const [anchorDesc, setAnchorDesc] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [joinCode, setJoinCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [rnd, setRnd] = useState(null)
  const [genning, setGenning] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => { setProfile(data); setLoading(false) })
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) router.push('/login')
      else setUser(s.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function genRandom() {
    setGenning(true); setRnd(null)
    const r = await fetch('/api/random-fighter')
    const f = await r.json()
    setRnd(f); setAnchorName(f.name); setAnchorDesc(f.desc||'')
    setGenning(false)
  }

  async function createRoom() {
    if (!anchorName.trim()) { setErr('Enter a fighter name'); return }
    setBusy(true); setErr('')
    const r = await fetch('/api/rooms/create', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ hostId: user.id, anchorName: anchorName.trim(), anchorDesc: anchorDesc.trim(), isPublic }) })
    const d = await r.json()
    if (d.error) { setErr(d.error); setBusy(false); return }
    router.push('/room/' + d.room.code)
  }

  async function joinRoom() {
    if (!joinCode.trim()) { setErr('Enter a room code'); return }
    setBusy(true); setErr('')
    const r = await fetch('/api/rooms/join', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code: joinCode.trim().toUpperCase(), playerId: user.id }) })
    const d = await r.json()
    if (d.error) { setErr(d.error); setBusy(false); return }
    router.push('/room/' + joinCode.trim().toUpperCase())
  }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spin" style={{width:40,height:40,border:'3px solid #222',borderTopColor:'#e63329',borderRadius:'50%'}}></div></div>

  return (
    <div>
      <nav className="nav">
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'.06em'}}>The House Fight Game</span>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button onClick={()=>router.push('/leaderboard')} className="btn bg" style={{width:'auto',padding:'4px 10px',fontSize:'.78rem'}}>🏆</button>
          {profile && <div onClick={()=>router.push('/profile')} style={{width:32,height:32,borderRadius:'50%',background:profile.avatar_color||'#e63329',color:'#f5f0e8',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'.75rem',cursor:'pointer'}}>{ini(profile.display_name)}</div>}
        </div>
      </nav>

      <div className="page">
        {!mode && (
          <div className="fi">
            <div style={{textAlign:'center',padding:'2rem 0 1.5rem'}}>
              <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2.5rem,12vw,4rem)',lineHeight:.92,marginBottom:'.75rem'}}>The<br /><span style={{color:'#e63329'}}>House</span><br />Fight Game</h1>
              <p style={{fontSize:'.9rem',color:'#888',marginBottom:'1.5rem'}}>Welcome back, <strong style={{color:'#f5f0e8'}}>{profile?.display_name}</strong></p>
            </div>

            {profile && profile.total_rounds > 0 && (
              <div className="card fi" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',textAlign:'center',marginBottom:'1.25rem'}}>
                {[
                  [profile.total_wins, 'Wins', '#1db954'],
                  [profile.total_rounds > 0 ? Math.round((profile.total_wins/profile.total_rounds)*100)+'%' : '0%', 'Win rate', '#f5f0e8'],
                  [(profile.biggest_upset_pct||0)+'%', 'Best upset', '#f5c842'],
                ].map(([v,l,c]) => (
                  <div key={l}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',color:c}}>{v}</div>
                    <div style={{fontSize:'.65rem',color:'#888',textTransform:'uppercase',letterSpacing:'.08em'}}>{l}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{display:'grid',gap:'10px',marginBottom:'1rem'}}>
              <button onClick={()=>setMode('create')} className="btn br">⚔️ Create a room</button>
              <button onClick={()=>setMode('join')} className="btn bg" style={{padding:'1rem',fontSize:'1rem'}}>🚪 Join with room code</button>
              <button onClick={()=>{setMode('random');genRandom()}} className="btn bp" style={{padding:'1rem',fontSize:'1rem'}}>🎲 Random fighter mode</button>
            </div>

            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={()=>router.push('/leaderboard')} className="btn bg" style={{flex:1,padding:'.65rem',fontSize:'.85rem'}}>🏆 Leaderboard</button>
              <button onClick={()=>router.push('/profile')} className="btn bg" style={{flex:1,padding:'.65rem',fontSize:'.85rem'}}>👤 Profile</button>
              <button onClick={()=>supabase.auth.signOut().then(()=>router.push('/login'))} className="btn bg" style={{flex:1,padding:'.65rem',fontSize:'.85rem'}}>Sign out</button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div className="fi">
            <button onClick={()=>setMode(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:'.875rem',marginBottom:'1.25rem'}}>← Back</button>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.4rem'}}>Create a room</h2>
            <p style={{fontSize:'.875rem',color:'#888',marginBottom:'1.75rem',lineHeight:1.6}}>Set the anchor fighter. Share the code. Everyone joins on their own phone.</p>
            <div className="field"><label>Anchor fighter name</label><input type="text" value={anchorName} onChange={e=>setAnchorName(e.target.value)} placeholder="e.g. Darth Vader" maxLength={60} /></div>
            <div className="field"><label>Description (optional)</label><input type="text" value={anchorDesc} onChange={e=>setAnchorDesc(e.target.value)} placeholder="e.g. Sith Lord, Force choke, lightsaber" maxLength={120} /></div>
            <div className="field" style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <input type="checkbox" id="pub" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} style={{width:'auto'}} />
              <label htmlFor="pub" style={{margin:0}}>Show on public lobby</label>
            </div>
            {err && <p style={{color:'#e63329',fontSize:'.85rem',marginBottom:'1rem'}}>{err}</p>}
            <button onClick={createRoom} disabled={busy} className="btn br">{busy?'Creating…':'Create room →'}</button>
          </div>
        )}

        {mode === 'join' && (
          <div className="fi">
            <button onClick={()=>setMode(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:'.875rem',marginBottom:'1.25rem'}}>← Back</button>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.4rem'}}>Join a room</h2>
            <p style={{fontSize:'.875rem',color:'#888',marginBottom:'1.75rem'}}>Enter the 6-character code from your host.</p>
            <div className="field"><label>Room code</label><input type="text" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="FGHT42" maxLength={6} style={{textTransform:'uppercase',letterSpacing:'.2em',fontSize:'1.5rem',textAlign:'center'}} /></div>
            {err && <p style={{color:'#e63329',fontSize:'.85rem',marginBottom:'1rem'}}>{err}</p>}
            <button onClick={joinRoom} disabled={busy} className="btn br">{busy?'Joining…':'Join room →'}</button>
          </div>
        )}

        {mode === 'random' && (
          <div className="fi">
            <button onClick={()=>{setMode(null);setRnd(null)}} style={{background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:'.875rem',marginBottom:'1.25rem'}}>← Back</button>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.4rem'}}>Random fighter</h2>
            <p style={{fontSize:'.875rem',color:'#888',marginBottom:'1.75rem'}}>The AI picks the anchor. Nobody chooses.</p>
            <div style={{background:'#0e0a1a',border:'2px solid #3b1a7a',borderRadius:12,padding:'1.5rem',textAlign:'center',marginBottom:'1.25rem',minHeight:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              {genning ? <div><div className="spin" style={{width:32,height:32,border:'3px solid #3b1a7a',borderTopColor:'#a78bfa',borderRadius:'50%',margin:'0 auto 8px'}}></div><p style={{color:'#a78bfa',fontSize:'.85rem'}}>Generating…</p></div>
              : rnd ? <div><p style={{fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#a78bfa',marginBottom:'.4rem'}}>{rnd.origin}</p><p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.3rem'}}>{rnd.name}</p><p style={{fontSize:'.8rem',color:'#888'}}>{rnd.desc}</p></div>
              : null}
            </div>
            {rnd && <div style={{display:'flex',gap:'9px'}}>
              <button onClick={genRandom} className="btn bg" style={{flex:1}}>🎲 Reroll</button>
              <button onClick={()=>setMode('create')} className="btn bp" style={{flex:2}}>Use this →</button>
            </div>}
          </div>
        )}
      </div>
    </div>
  )
}

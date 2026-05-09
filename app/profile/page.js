'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PLAYER_COLORS, getInitials } from '@/lib/colors'

export default function Profile() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const viewId = searchParams.get('id')

  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !viewId) { router.push('/login'); return }
      setCurrentUser(session?.user || null)
      const targetId = viewId || session?.user?.id
      fetch(`/api/profile?id=${targetId}`).then(r=>r.json()).then(d => {
        setProfile(d.profile); setHistory(d.history||[])
        setEditName(d.profile?.display_name||'')
        setEditColor(d.profile?.avatar_color||'#e63329')
        setLoading(false)
      })
    })
  }, [viewId])

  async function saveProfile() {
    setSaving(true)
    const r = await fetch('/api/profile', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentUser.id, display_name: editName, avatar_color: editColor })
    })
    const d = await r.json()
    setProfile(d.profile); setEditing(false); setSaving(false)
  }

  const isOwn = currentUser && profile && currentUser.id === profile.id
  const winRate = profile?.total_rounds > 0 ? Math.round((profile.total_wins/profile.total_rounds)*100) : 0

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:40,height:40,border:'3px solid #222',borderTopColor:'var(--red)',borderRadius:'50%'}} className="spin"></div></div>
  if (!profile) return null

  return (
    <div>
      <nav className="nav">
        <button onClick={() => router.push('/')} style={{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'.875rem'}}>← Home</button>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'.06em'}}>Player Profile</span>
        <div></div>
      </nav>
      <div className="page">
        {/* PROFILE HEADER */}
        <div className="card fade-in" style={{textAlign:'center',padding:'2rem 1.25rem',marginBottom:'1.1rem'}}>
          <div style={{width:72,height:72,borderRadius:'50%',background:profile.avatar_color||'var(--red)',color:'var(--white)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',margin:'0 auto 1rem'}}>
            {getInitials(profile.display_name)}
          </div>
          {editing ? (
            <div>
              <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} style={{textAlign:'center',marginBottom:'1rem'}} maxLength={30} />
              <div style={{display:'flex',gap:'8px',justifyContent:'center',flexWrap:'wrap',marginBottom:'1rem'}}>
                {PLAYER_COLORS.map(c => (
                  <div key={c} onClick={() => setEditColor(c)} style={{width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',border:editColor===c?'3px solid var(--white)':'3px solid transparent',transition:'border .15s'}}></div>
                ))}
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={() => setEditing(false)} className="btn bg" style={{flex:1}}>Cancel</button>
                <button onClick={saveProfile} disabled={saving} className="btn br" style={{flex:1}}>{saving?'Saving…':'Save'}</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.25rem'}}>{profile.display_name}</h2>
              {isOwn && <button onClick={() => setEditing(true)} className="btn bg" style={{display:'inline-block',width:'auto',padding:'5px 14px',fontSize:'.8rem',marginTop:'.5rem'}}>Edit profile</button>}
            </div>
          )}
        </div>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'1.1rem'}}>
          {[
            {val:profile.total_wins,lbl:'Total wins',col:'var(--green)'},
            {val:`${winRate}%`,lbl:'Win rate',col:'var(--white)'},
            {val:profile.total_rounds,lbl:'Rounds played',col:'var(--white)'},
            {val:`${profile.biggest_upset_pct||0}%`,lbl:'Biggest upset',col:'var(--yellow)'},
          ].map(s => (
            <div key={s.lbl} className="card" style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',color:s.col,marginBottom:'2px'}}>{s.val}</div>
              <div style={{fontSize:'.68rem',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.08em'}}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* BIGGEST UPSET */}
        {profile.biggest_upset_fighter && (
          <div className="card fade-in" style={{marginBottom:'1.1rem',borderLeft:'3px solid var(--yellow)'}}>
            <p style={{fontSize:'.65rem',color:'var(--yellow)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:'.4rem'}}>🔥 Biggest upset</p>
            <p style={{fontWeight:500,marginBottom:'2px'}}>{profile.biggest_upset_fighter}</p>
            <p style={{fontSize:'.78rem',color:'var(--dim)'}}>beat {profile.biggest_upset_anchor} at {profile.biggest_upset_pct}% win probability</p>
          </div>
        )}

        {/* FIGHT HISTORY */}
        {history.length > 0 && (
          <div>
            <p className="section-label">Recent fight history</p>
            {history.map((r, i) => (
              <div key={r.id} className="card fade-in" style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'.5rem',animationDelay:`${i*.04}s`,opacity:r.winner==='challenger'?1:.7}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:r.winner==='challenger'?'var(--green)':'#c04040',flexShrink:0}}></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'.875rem',fontWeight:500}}>{r.challenger_name}</div>
                  <div style={{fontSize:'.7rem',color:'var(--dim)'}}>vs {r.anchor_name}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'.75rem',fontWeight:600,color:r.winner==='challenger'?'var(--green)':'#c04040'}}>{r.winner==='challenger'?'WIN':'LOSS'}</div>
                  <div style={{fontSize:'.65rem',color:'var(--dim)'}}>{r.challenger_win_pct}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

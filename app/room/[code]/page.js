'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { getInitials } from '@/lib/colors'

export default function RoomPage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [room, setRoom] = useState(null)
  const [round, setRound] = useState(null)
  const [players, setPlayers] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [results, setResults] = useState([])
  const [mySubmission, setMySubmission] = useState(null)
  const [challengerName, setChallengerName] = useState('')
  const [challengerDesc, setChallengerDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const [newAnchorName, setNewAnchorName] = useState('')
  const [newAnchorDesc, setNewAnchorDesc] = useState('')
  const [startingNewRound, setStartingNewRound] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const isHost = room && user && room.host_id === user.id

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
    })
  }, [])

  const fetchRoomData = useCallback(async () => {
    if (!code) return
    const { data: roomData } = await supabase.from('rooms').select('*').eq('code', code).single()
    if (!roomData) { router.push('/'); return }
    setRoom(roomData)

    const { data: roundData } = await supabase.from('rounds')
      .select('*').eq('room_id', roomData.id).order('round_number', { ascending: false }).limit(1).single()
    setRound(roundData)

    const { data: playerData } = await supabase.from('room_players')
      .select('*, profiles(*)').eq('room_id', roomData.id)
    setPlayers(playerData || [])

    if (roundData) {
      const { data: subData } = await supabase.from('submissions').select('*, profiles(*)').eq('round_id', roundData.id)
      setSubmissions(subData || [])

      const { data: resultData } = await supabase.from('fight_results').select('*').eq('round_id', roundData.id)
      setResults(resultData || [])
    }
    setLoading(false)
  }, [code])

  useEffect(() => { if (user) fetchRoomData() }, [user, fetchRoomData])

  // Realtime subscriptions
  useEffect(() => {
    if (!room) return
    const sub = supabase.channel(`room-${room.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` }, fetchRoomData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions', filter: `round_id=eq.${round?.id}` }, fetchRoomData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fight_results', filter: `round_id=eq.${round?.id}` }, fetchRoomData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${room.id}` }, fetchRoomData)
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [room?.id, round?.id])

  useEffect(() => {
    if (user && submissions.length) {
      const mine = submissions.find(s => s.player_id === user.id)
      setMySubmission(mine || null)
    }
  }, [submissions, user])

  async function submitChallenger() {
    if (!challengerName.trim() || !round) return
    setSubmitting(true)
    await fetch('/api/rooms/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roundId: round.id, playerId: user.id, challengerName: challengerName.trim(), challengerDesc: challengerDesc.trim() })
    })
    setChallengerName(''); setChallengerDesc('')
    setSubmitting(false)
  }

  async function simulate() {
    if (!isHost || !round) return
    setSimulating(true)
    await fetch('/api/rooms/simulate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roundId: round.id, roomId: room.id })
    })
    setSimulating(false)
  }

  async function startNewRound() {
    if (!isHost || !newAnchorName.trim()) return
    setStartingNewRound(true)
    await fetch('/api/rooms/new-round', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: room.id, anchorName: newAnchorName.trim(), anchorDesc: newAnchorDesc.trim(), hostId: user.id })
    })
    setNewAnchorName(''); setNewAnchorDesc('')
    setStartingNewRound(false)
    fetchRoomData()
  }

  function copyCode() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:40,height:40,border:'3px solid #222',borderTopColor:'var(--red)',borderRadius:'50%'}} className="spin"></div></div>
  if (!room) return null

  const status = room.status
  const myResult = results.find(r => r.player_id === user?.id)

  return (
    <div>
      <nav className="nav">
        <button onClick={() => router.push('/')} style={{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'.875rem'}}>← Home</button>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <span className="chip chip-dim" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'.1em'}}>{code}</span>
          <button onClick={copyCode} className="btn bg" style={{padding:'4px 10px',fontSize:'.75rem',width:'auto'}}>{copied ? '✓ Copied' : 'Copy code'}</button>
        </div>
      </nav>

      <div className="page">
        {/* ANCHOR */}
        <div className="card fade-in" style={{background:'linear-gradient(135deg,#1a0505,#0a0a0a)',border:'1px solid #3a0a0a',marginBottom:'1.1rem'}}>
          <div style={{fontSize:'.68rem',color:'var(--red)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.3rem'}}>Anchor fighter</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',lineHeight:1,marginBottom:'.25rem'}}>{room.anchor_name}</div>
          {room.anchor_desc && <div style={{fontSize:'.8rem',color:'var(--dim)'}}>{room.anchor_desc}</div>}
        </div>

        {/* PLAYERS */}
        <div style={{marginBottom:'1.1rem'}}>
          <p className="section-label">Players ({players.length})</p>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {players.map(p => (
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:'6px',background:'var(--cb)',border:'1px solid var(--border)',borderRadius:'99px',padding:'4px 10px 4px 4px'}}>
                <div className="avatar-sm" style={{width:24,height:24,background:p.profiles?.avatar_color||'var(--red)',color:'var(--white)',fontSize:'.6rem'}}>
                  {getInitials(p.profiles?.display_name||'P')}
                </div>
                <span style={{fontSize:'.8rem'}}>{p.profiles?.display_name}</span>
                {p.player_id === room.host_id && <span style={{fontSize:'.6rem',color:'var(--yellow)'}}>👑</span>}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT PHASE */}
        {status === 'submitting' && (
          <div className="fade-in">
            <p className="section-label">Round {round?.round_number} — Pick your challenger</p>
            {!mySubmission ? (
              <div className="card" style={{marginBottom:'1rem'}}>
                <div className="field"><label>Your challenger vs {room.anchor_name}</label><input type="text" value={challengerName} onChange={e=>setChallengerName(e.target.value)} placeholder="e.g. Pootie Tang" maxLength={60} /></div>
                <div className="field"><label>Description (optional)</label><input type="text" value={challengerDesc} onChange={e=>setChallengerDesc(e.target.value)} placeholder="e.g. Belt master, sa da tay" maxLength={120} /></div>
                <button onClick={submitChallenger} disabled={submitting||!challengerName.trim()} className="btn br">{submitting?'Submitting…':'Submit challenger'}</button>
              </div>
            ) : (
              <div className="card chip-green" style={{marginBottom:'1rem',textAlign:'center',background:'#0f1a14',border:'1px solid var(--green)'}}>
                <p style={{fontSize:'.75rem',color:'var(--green)',marginBottom:'4px'}}>✓ You submitted</p>
                <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.4rem'}}>{mySubmission.challenger_name}</p>
                {mySubmission.challenger_desc && <p style={{fontSize:'.78rem',color:'var(--dim)'}}>{mySubmission.challenger_desc}</p>}
              </div>
            )}

            <div style={{marginBottom:'1rem'}}>
              <p className="section-label">Submissions ({submissions.length}/{players.length})</p>
              {submissions.map(s => (
                <div key={s.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'.6rem .875rem',background:'var(--cb)',border:'1px solid var(--border)',borderRadius:'8px',marginBottom:'5px'}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:s.profiles?.avatar_color||'#888',color:'var(--white)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.6rem',flexShrink:0}}>{getInitials(s.profiles?.display_name||'P')}</div>
                  <span style={{fontSize:'.85rem',flex:1}}>{s.profiles?.display_name}</span>
                  <span style={{color:'var(--green)',fontSize:'.9rem'}}>✓</span>
                </div>
              ))}
              {players.filter(p => !submissions.find(s => s.player_id === p.player_id)).map(p => (
                <div key={p.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'.6rem .875rem',background:'var(--cb)',border:'1px solid var(--border)',borderRadius:'8px',marginBottom:'5px',opacity:.5}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:p.profiles?.avatar_color||'#888',color:'var(--white)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.6rem',flexShrink:0}}>{getInitials(p.profiles?.display_name||'P')}</div>
                  <span style={{fontSize:'.85rem',flex:1}}>{p.profiles?.display_name}</span>
                  <span style={{fontSize:'.75rem',color:'var(--dim)'}}>waiting…</span>
                </div>
              ))}
            </div>

            {isHost && submissions.length > 0 && (
              <button onClick={simulate} disabled={simulating} className="btn br">
                {simulating ? 'Simulating all fights…' : `Simulate all ${submissions.length} fights →`}
              </button>
            )}
            {!isHost && <p style={{fontSize:'.8rem',color:'var(--dim)',textAlign:'center'}}>Waiting for host to run the simulation…</p>}
          </div>
        )}

        {/* SIMULATING */}
        {status === 'simulating' && (
          <div className="fade-in" style={{textAlign:'center',padding:'2rem 0'}}>
            <div style={{width:48,height:48,border:'3px solid #222',borderTopColor:'var(--red)',borderRadius:'50%',margin:'0 auto 1rem'}} className="spin"></div>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.5rem',marginBottom:'.4rem'}}>Running the simulation</p>
            <p style={{fontSize:'.85rem',color:'var(--dim)'}}>The AI is deciding who walks away…</p>
          </div>
        )}

        {/* RESULTS */}
        {(status === 'results' || status === 'complete') && results.length > 0 && (
          <div className="fade-in">
            <p className="section-label" style={{marginBottom:'1rem'}}>Round {round?.round_number} results</p>
            {results
              .sort((a,b) => (b.winner==='challenger'?1:0) - (a.winner==='challenger'?1:0))
              .map((res, i) => {
                const sub = submissions.find(s => s.id === res.submission_id)
                const pl = players.find(p => p.player_id === res.player_id)
                const isWin = res.winner === 'challenger'
                const anchColor = 'var(--red)'
                const challColor = pl?.profiles?.avatar_color || '#888'
                const challPct = res.challenger_win_pct
                const anchPct = 100 - challPct

                return (
                  <div key={res.id} className="card fade-in" style={{marginBottom:'.75rem',animationDelay:`${i*.08}s`,border:`1px solid ${isWin?'var(--green)':'var(--border)'}`,opacity:isWin?1:.8}}>
                    <div style={{display:'flex',alignItems:'center',gap:'9px',marginBottom:'.75rem'}}>
                      <div style={{width:34,height:34,borderRadius:'50%',background:challColor+'22',color:challColor,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'.8rem',flexShrink:0}}>{getInitials(res.challenger_name)}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'.9rem',fontWeight:500}}>{res.challenger_name}</div>
                        <div style={{fontSize:'.72rem',color:'var(--dim)'}}>Picked by {pl?.profiles?.display_name}</div>
                      </div>
                      <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'3px 7px',borderRadius:'4px',background:isWin?'#0f3320':'#2a1010',color:isWin?'var(--green)':'#c04040'}}>{isWin?'WIN':'LOSS'}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'baseline',gap:'7px',marginBottom:'.4rem'}}>
                      <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',color:isWin?'#1db954':'#c04040'}}>{challPct}%</span>
                      <span style={{fontSize:'.72rem',color:'var(--dim)'}}>win probability vs {room.anchor_name}</span>
                    </div>
                    {res.stats && res.stats.length > 0 && (
                      <div style={{marginBottom:'.65rem'}}>
                        {res.stats.map((s,j) => (
                          <div key={j} style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:'4px'}}>
                            <span style={{fontSize:'.68rem',color:'var(--dim)',width:'85px',flexShrink:0}}>{s.name}</span>
                            <div style={{flex:1,height:'4px',background:'#222',borderRadius:'2px',overflow:'hidden'}}>
                              <div style={{height:'100%',width:`${Math.round(s.b/(s.a+s.b)*100)}%`,background:challColor,borderRadius:'2px'}}></div>
                            </div>
                            <span style={{fontSize:'.68rem',fontWeight:600,width:'20px',textAlign:'right',color:'var(--dim)'}}>{s.b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{display:'flex',height:'5px',borderRadius:'3px',overflow:'hidden',marginBottom:'.65rem'}}>
                      <div style={{width:`${challPct}%`,background:challColor}}></div>
                      <div style={{width:`${anchPct}%`,background:anchColor}}></div>
                    </div>
                    <div style={{borderRadius:'9px',padding:'.875rem 1rem',borderLeft:`3px solid ${isWin?'var(--green)':'#3a1212'}`,background:'#0c0c0c'}}>
                      <p style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--dim)',marginBottom:'.5rem'}}>{isWin?'🏆':'💀'} How it went down</p>
                      <p style={{fontSize:'.88rem',lineHeight:1.65,color:'var(--white)'}}>{res.quip}</p>
                      {res.verdict && <p style={{fontSize:'.74rem',color:'#777',fontStyle:'italic',marginTop:'.5rem',paddingTop:'.5rem',borderTop:'1px solid #1e1e1e'}}>{res.verdict}</p>}
                    </div>
                    {res.is_upset && <div style={{marginTop:'.5rem'}}><span className="chip" style={{background:'#1a1000',color:'var(--yellow)',border:'1px solid var(--yellow)'}}>🔥 Upset!</span></div>}
                  </div>
                )
              })}

            {/* NEW ROUND (host only) */}
            {isHost && (
              <div className="card" style={{marginTop:'1.5rem',background:'#111'}}>
                <p className="section-label">Start a new round</p>
                <div className="field"><label>New anchor fighter</label><input type="text" value={newAnchorName} onChange={e=>setNewAnchorName(e.target.value)} placeholder="e.g. Monique from Precious" maxLength={60} /></div>
                <div className="field"><label>Description (optional)</label><input type="text" value={newAnchorDesc} onChange={e=>setNewAnchorDesc(e.target.value)} placeholder="e.g. Zero remorse, frying pan" maxLength={120} /></div>
                <button onClick={startNewRound} disabled={startingNewRound||!newAnchorName.trim()} className="btn br">{startingNewRound?'Starting…':'Start new round →'}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { ini } from '@/lib/colors'
import '../../globals.css'

export default function RoomPage() {
  const router = useRouter()
  const { code } = useParams()
  const [user, setUser] = useState(null)
  const [room, setRoom] = useState(null)
  const [round, setRound] = useState(null)
  const [players, setPlayers] = useState([])
  const [subs, setSubs] = useState([])
  const [results, setResults] = useState([])
  const [mySubmission, setMySubmission] = useState(null)
  const [challName, setChallName] = useState('')
  const [challDesc, setChallDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [simming, setSimming] = useState(false)
  const [newAnch, setNewAnch] = useState('')
  const [newAnchDesc, setNewAnchDesc] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
    })
  }, [])

  const load = useCallback(async () => {
    if (!code) return
    const { data: r } = await supabase.from('rooms').select('*').eq('code', code).single()
    if (!r) { router.push('/'); return }
    setRoom(r)
    const { data: rd } = await supabase.from('rounds').select('*').eq('room_id', r.id).order('round_number',{ascending:false}).limit(1).single()
    setRound(rd)
    const { data: ps } = await supabase.from('room_players').select('*, profiles(*)').eq('room_id', r.id)
    setPlayers(ps||[])
    if (rd) {
      const { data: ss } = await supabase.from('submissions').select('*, profiles(*)').eq('round_id', rd.id)
      setSubs(ss||[])
      const { data: rrs } = await supabase.from('fight_results').select('*').eq('round_id', rd.id)
      setResults(rrs||[])
    }
    setLoading(false)
  }, [code])

  useEffect(() => { if (user) load() }, [user, load])

  useEffect(() => {
    if (!room?.id) return
    const ch = supabase.channel('room-'+room.id)
      .on('postgres_changes',{event:'*',schema:'public',table:'rooms',filter:'id=eq.'+room.id},load)
      .on('postgres_changes',{event:'*',schema:'public',table:'submissions'},load)
      .on('postgres_changes',{event:'*',schema:'public',table:'fight_results'},load)
      .on('postgres_changes',{event:'*',schema:'public',table:'room_players',filter:'room_id=eq.'+room.id},load)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [room?.id, load])

  useEffect(() => {
    if (user && subs.length) setMySubmission(subs.find(s=>s.player_id===user.id)||null)
    else setMySubmission(null)
  }, [subs, user])

  async function submit() {
    if (!challName.trim()||!round) return
    setSubmitting(true)
    await fetch('/api/rooms/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({roundId:round.id,playerId:user.id,challengerName:challName.trim(),challengerDesc:challDesc.trim()})})
    setChallName('');setChallDesc('')
    setSubmitting(false)
  }

  async function simulate() {
    if (!round) return
    setSimming(true)
    await fetch('/api/rooms/simulate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({roundId:round.id,roomId:room.id})})
    setSimming(false)
  }

  async function startNewRound() {
    if (!newAnch.trim()) return
    await fetch('/api/rooms/new-round',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({roomId:room.id,anchorName:newAnch.trim(),anchorDesc:newAnchDesc.trim(),hostId:user.id})})
    setNewAnch('');setNewAnchDesc('')
    load()
  }

  function copyCode() { navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),2000) }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spin" style={{width:40,height:40,border:'3px solid #222',borderTopColor:'#e63329',borderRadius:'50%'}}></div></div>
  if (!room||!user) return null

  const isHost = room.host_id===user.id
  const status = room.status

  return (
    <div>
      <nav className="nav">
        <button onClick={()=>router.push('/')} style={{background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:'.875rem'}}>← Home</button>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span className="chip chip-dim" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1rem',letterSpacing:'.1em'}}>{code}</span>
          <button onClick={copyCode} className="btn bg" style={{padding:'4px 10px',fontSize:'.75rem',width:'auto'}}>{copied?'✓ Copied':'Copy code'}</button>
        </div>
      </nav>

      <div className="page">
        <div className="card fi" style={{background:'linear-gradient(135deg,#1a0505,#0a0a0a)',border:'1px solid #3a0a0a',marginBottom:'1.1rem'}}>
          <div style={{fontSize:'.68rem',color:'#e63329',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:'.3rem'}}>Anchor fighter — Round {round?.round_number}</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',lineHeight:1,marginBottom:'.25rem'}}>{room.anchor_name}</div>
          {room.anchor_desc && <div style={{fontSize:'.8rem',color:'#888'}}>{room.anchor_desc}</div>}
        </div>

        <div style={{marginBottom:'1.1rem'}}>
          <p className="slbl">Players ({players.length}) — share code <strong style={{color:'#f5f0e8'}}>{code}</strong></p>
          <div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}>
            {players.map(p=>(
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:'5px',background:'#141414',border:'1px solid #2a2a2a',borderRadius:'99px',padding:'3px 9px 3px 3px'}}>
                <div style={{width:22,height:22,borderRadius:'50%',background:p.profiles?.avatar_color||'#e63329',color:'#f5f0e8',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'.6rem'}}>{ini(p.profiles?.display_name||'P')}</div>
                <span style={{fontSize:'.78rem'}}>{p.profiles?.display_name}</span>
                {p.player_id===room.host_id && <span style={{fontSize:'.6rem'}}>👑</span>}
              </div>
            ))}
          </div>
        </div>

        {status==='submitting' && (
          <div className="fi">
            {!mySubmission ? (
              <div className="card" style={{marginBottom:'1rem'}}>
                <div className="field"><label>Your challenger vs {room.anchor_name}</label><input type="text" value={challName} onChange={e=>setChallName(e.target.value)} placeholder="e.g. Pootie Tang" maxLength={60} /></div>
                <div className="field"><label>Description (optional)</label><input type="text" value={challDesc} onChange={e=>setChallDesc(e.target.value)} placeholder="e.g. Belt master, sa da tay" maxLength={120} /></div>
                <button onClick={submit} disabled={submitting||!challName.trim()} className="btn br">{submitting?'Submitting…':'Submit challenger'}</button>
              </div>
            ) : (
              <div className="card" style={{marginBottom:'1rem',textAlign:'center',background:'#0f1a14',border:'1px solid #1db954'}}>
                <p style={{fontSize:'.75rem',color:'#1db954',marginBottom:'4px'}}>✓ You submitted</p>
                <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.4rem'}}>{mySubmission.challenger_name}</p>
                {mySubmission.challenger_desc && <p style={{fontSize:'.78rem',color:'#888'}}>{mySubmission.challenger_desc}</p>}
              </div>
            )}

            <p className="slbl" style={{marginTop:'.5rem'}}>Submissions ({subs.length}/{players.length})</p>
            {players.map(p=>{
              const sub = subs.find(s=>s.player_id===p.player_id)
              return (
                <div key={p.id} style={{display:'flex',alignItems:'center',gap:'9px',padding:'.6rem .875rem',background:'#141414',border:'1px solid #2a2a2a',borderRadius:'8px',marginBottom:'5px',opacity:sub?1:.55}}>
                  <div style={{width:22,height:22,borderRadius:'50%',background:p.profiles?.avatar_color||'#888',color:'#f5f0e8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.6rem',flexShrink:0}}>{ini(p.profiles?.display_name||'P')}</div>
                  <span style={{fontSize:'.85rem',flex:1}}>{p.profiles?.display_name}</span>
                  {sub ? <span style={{color:'#1db954'}}>✓</span> : <span style={{fontSize:'.72rem',color:'#888'}}>waiting…</span>}
                </div>
              )
            })}

            {isHost && subs.length > 0 && (
              <button onClick={simulate} disabled={simming} className="btn br" style={{marginTop:'1rem'}}>
                {simming ? 'Simulating…' : `Simulate all ${subs.length} fights →`}
              </button>
            )}
            {!isHost && <p style={{fontSize:'.8rem',color:'#888',textAlign:'center',marginTop:'1rem'}}>Waiting for host to simulate…</p>}
          </div>
        )}

        {status==='simulating' && (
          <div className="fi" style={{textAlign:'center',padding:'2rem 0'}}>
            <div className="spin" style={{width:48,height:48,border:'3px solid #222',borderTopColor:'#e63329',borderRadius:'50%',margin:'0 auto 1rem'}}></div>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.5rem',marginBottom:'.4rem'}}>Running the simulation</p>
            <p style={{fontSize:'.85rem',color:'#888'}}>The AI is deciding who walks away…</p>
          </div>
        )}

        {(status==='results'||status==='complete') && results.length>0 && (
          <div className="fi">
            <p className="slbl">Round {round?.round_number} results</p>
            {results.sort((a,b)=>(b.winner==='challenger'?1:0)-(a.winner==='challenger'?1:0)).map((res,i)=>{
              const pl = players.find(p=>p.player_id===res.player_id)
              const isW = res.winner==='challenger'
              const col = pl?.profiles?.avatar_color||'#888'
              const cp = res.challenger_win_pct
              return (
                <div key={res.id} className="card fi" style={{marginBottom:'.75rem',animationDelay:i*.08+'s',border:'1px solid '+(isW?'#1db954':'#2a2a2a'),opacity:isW?1:.8}}>
                  <div style={{display:'flex',alignItems:'center',gap:'9px',marginBottom:'.75rem'}}>
                    <div style={{width:34,height:34,borderRadius:'50%',background:col+'22',color:col,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'.8rem',flexShrink:0}}>{ini(res.challenger_name)}</div>
                    <div style={{flex:1}}><div style={{fontSize:'.9rem',fontWeight:500}}>{res.challenger_name}</div><div style={{fontSize:'.72rem',color:'#888'}}>Picked by {pl?.profiles?.display_name}</div></div>
                    <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',padding:'3px 7px',borderRadius:4,background:isW?'#0f3320':'#2a1010',color:isW?'#1db954':'#c04040'}}>{isW?'WIN':'LOSS'}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'baseline',gap:'7px',marginBottom:'.4rem'}}>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.75rem',color:isW?'#1db954':'#c04040'}}>{cp}%</span>
                    <span style={{fontSize:'.72rem',color:'#888'}}>win probability vs {room.anchor_name}</span>
                  </div>
                  {res.stats && res.stats.map((s,j)=>(
                    <div key={j} style={{display:'flex',alignItems:'center',gap:'7px',marginBottom:4}}>
                      <span style={{fontSize:'.68rem',color:'#888',width:85,flexShrink:0}}>{s.name}</span>
                      <div style={{flex:1,height:4,background:'#222',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:Math.round(s.b/(s.a+s.b)*100)+'%',background:col,borderRadius:2}}></div></div>
                      <span style={{fontSize:'.68rem',fontWeight:600,width:20,textAlign:'right',color:'#888'}}>{s.b}</span>
                    </div>
                  ))}
                  <div style={{display:'flex',height:5,borderRadius:3,overflow:'hidden',margin:'.65rem 0'}}>
                    <div style={{width:cp+'%',background:col}}></div><div style={{width:(100-cp)+'%',background:'#e63329'}}></div>
                  </div>
                  <div style={{borderRadius:9,padding:'.875rem 1rem',borderLeft:'3px solid '+(isW?'#1db954':'#3a1212'),background:'#0c0c0c'}}>
                    <p style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'#888',marginBottom:'.5rem'}}>{isW?'🏆':'💀'} How it went down</p>
                    <p style={{fontSize:'.88rem',lineHeight:1.65,color:'#f5f0e8'}}>{res.quip}</p>
                    {res.verdict && <p style={{fontSize:'.74rem',color:'#777',fontStyle:'italic',marginTop:'.5rem',paddingTop:'.5rem',borderTop:'1px solid #1e1e1e'}}>{res.verdict}</p>}
                  </div>
                  {res.is_upset && <div style={{marginTop:'.5rem'}}><span className="chip" style={{background:'#1a1000',color:'#f5c842',border:'1px solid #f5c842'}}>🔥 Upset!</span></div>}
                </div>
              )
            })}

            {isHost && (
              <div className="card" style={{marginTop:'1.5rem',background:'#111'}}>
                <p className="slbl">Start a new round</p>
                <div className="field"><label>New anchor fighter</label><input type="text" value={newAnch} onChange={e=>setNewAnch(e.target.value)} placeholder="e.g. Monique from Precious" maxLength={60} /></div>
                <div className="field"><label>Description (optional)</label><input type="text" value={newAnchDesc} onChange={e=>setNewAnchDesc(e.target.value)} placeholder="e.g. Zero remorse, frying pan" maxLength={120} /></div>
                <button onClick={startNewRound} disabled={!newAnch.trim()} className="btn br">Start new round →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

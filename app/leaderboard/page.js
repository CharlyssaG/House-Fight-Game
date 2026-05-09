'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getInitials } from '@/lib/colors'
import { supabase } from '@/lib/supabase'

export default function Leaderboard() {
  const router = useRouter()
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard').then(r=>r.json()).then(d=>{ setBoard(d.leaderboard||[]); setLoading(false) })
  }, [])

  const medals = ['🥇','🥈','🥉']

  return (
    <div>
      <nav className="nav">
        <button onClick={() => router.push('/')} style={{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'.875rem'}}>← Home</button>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'.06em'}}>Global Leaderboard</span>
        <div></div>
      </nav>
      <div className="page">
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.4rem'}}>Hall of Champions</h2>
        <p style={{fontSize:'.875rem',color:'var(--dim)',marginBottom:'1.5rem'}}>Ranked by total wins. Play more rounds to climb the board.</p>
        {loading ? (
          <div style={{textAlign:'center',padding:'3rem 0'}}><div style={{width:36,height:36,border:'3px solid #222',borderTopColor:'var(--red)',borderRadius:'50%',margin:'0 auto'}} className="spin"></div></div>
        ) : board.length === 0 ? (
          <div className="card" style={{textAlign:'center',padding:'3rem',color:'var(--dim)'}}>No one on the board yet. Play some rounds!</div>
        ) : (
          board.map((p, i) => (
            <div key={p.id} className="card fade-in" style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'.65rem',animationDelay:`${i*.05}s`,cursor:'pointer',border:i<3?`1px solid ${['#f5c842','#aaa','#cd7f32'][i]}22`:'1px solid var(--border)'}}
              onClick={() => router.push(`/profile?id=${p.id}`)}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.4rem',width:'30px',textAlign:'center',color:i<3?['var(--yellow)','#aaa','#cd7f32'][i]:'var(--dim)'}}>{medals[i] || i+1}</div>
              <div style={{width:40,height:40,borderRadius:'50%',background:p.avatar_color||'var(--red)',color:'var(--white)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'.9rem',flexShrink:0}}>{getInitials(p.display_name)}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:'.95rem',marginBottom:'2px'}}>{p.display_name}</div>
                <div style={{fontSize:'.72rem',color:'var(--dim)'}}>{p.win_rate}% win rate · {p.total_rounds} rounds played</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.5rem',color:'var(--green)'}}>{p.total_wins}</div>
                <div style={{fontSize:'.65rem',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'.06em'}}>wins</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

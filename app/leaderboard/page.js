'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ini } from '@/lib/colors'
import '../globals.css'

export default function Leaderboard() {
  const router = useRouter()
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard').then(r=>r.json()).then(d=>{setBoard(d.leaderboard||[]);setLoading(false)})
  }, [])

  return (
    <div>
      <nav className="nav">
        <button onClick={()=>router.push('/')} style={{background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:'.875rem'}}>← Home</button>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem'}}>Global Leaderboard</span>
        <div></div>
      </nav>
      <div className="page">
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',marginBottom:'.4rem'}}>Hall of Champions</h2>
        <p style={{fontSize:'.875rem',color:'#888',marginBottom:'1.5rem'}}>Ranked by total wins.</p>
        {loading
          ? <div style={{textAlign:'center',padding:'3rem 0'}}><div className="spin" style={{width:36,height:36,border:'3px solid #222',borderTopColor:'#e63329',borderRadius:'50%',margin:'0 auto'}}></div></div>
          : board.length===0
            ? <div className="card" style={{textAlign:'center',padding:'3rem',color:'#888'}}>No one on the board yet. Play some rounds!</div>
            : board.map((p,i)=>(
              <div key={p.id} className="card fi" style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'.65rem',animationDelay:i*.04+'s',cursor:'pointer',border:i<3?'1px solid '+['#f5c84222','#aaaaaa22','#cd7f3222'][i]:'1px solid #2a2a2a'}}
                onClick={()=>router.push('/profile?id='+p.id)}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.4rem',width:28,textAlign:'center',color:i<3?['#f5c842','#aaa','#cd7f32'][i]:'#888'}}>{['🥇','🥈','🥉'][i]||i+1}</div>
                <div style={{width:40,height:40,borderRadius:'50%',background:p.avatar_color||'#e63329',color:'#f5f0e8',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'.9rem',flexShrink:0}}>{ini(p.display_name)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,marginBottom:2}}>{p.display_name}</div>
                  <div style={{fontSize:'.72rem',color:'#888'}}>{p.win_rate}% win rate · {p.total_rounds} rounds</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.5rem',color:'#1db954'}}>{p.total_wins}</div>
                  <div style={{fontSize:'.65rem',color:'#888',textTransform:'uppercase',letterSpacing:'.06em'}}>wins</div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

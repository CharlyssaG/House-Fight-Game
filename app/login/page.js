'use client'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/')
    })
  }, [])

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/` }
    })
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',background:'var(--black)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 30%,#3a0a0a 0%,transparent 65%)',pointerEvents:'none'}}></div>
      <div style={{position:'relative',zIndex:1,padding:'2.5rem 1.5rem',maxWidth:'400px',width:'100%'}}>
        <p style={{fontSize:'.7rem',letterSpacing:'.25em',textTransform:'uppercase',color:'var(--red)',marginBottom:'.75rem',fontWeight:500}}>AI-Powered Party Game</p>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(3rem,14vw,5rem)',lineHeight:.92,marginBottom:'1rem'}}>
          The<br /><span style={{color:'var(--red)'}}>House</span><br />Fight<br />Game
        </h1>
        <p style={{fontSize:'.9rem',color:'var(--dim)',marginBottom:'2.5rem',lineHeight:1.6}}>
          One fighter. Everyone picks a challenger.<br />The AI runs the numbers. The world watches.
        </p>
        <button onClick={signInWithGoogle} className="btn br" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',fontSize:'1rem',fontFamily:"'DM Sans',sans-serif",letterSpacing:0,padding:'1rem'}}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>
        <p style={{fontSize:'.75rem',color:'var(--dim)',marginTop:'1.25rem'}}>Your stats, wins, and history saved across every game.</p>
      </div>
    </div>
  )
}

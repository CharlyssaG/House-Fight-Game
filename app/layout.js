export const metadata = { title: 'The House Fight Game', description: 'AI-powered party fight game' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" /></head>
      <body style={{margin:0,background:'#0a0a0a',color:'#f5f0e8',fontFamily:"'DM Sans',sans-serif",minHeight:'100vh'}}>{children}</body>
    </html>
  )
}

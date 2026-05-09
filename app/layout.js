export const metadata = {
  title: 'The House Fight Game',
  description: 'One fighter. Everyone picks a challenger. The AI runs the numbers.',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{margin:0,background:'#0a0a0a',color:'#f5f0e8',fontFamily:"'DM Sans',sans-serif"}}>{children}</body>
    </html>
  )
}

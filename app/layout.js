export const metadata = {
  title: 'The House Fight Game',
  description: 'One fighter. Everyone picks a challenger. The AI runs the numbers.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

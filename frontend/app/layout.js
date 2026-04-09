import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'Influencer Detection Dashboard',
  description: 'Social Network Influencer Analysis using Link Analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen antialiased">
        <Navbar />
        <main className="container mx-auto px-4 py-8 lg:px-8">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

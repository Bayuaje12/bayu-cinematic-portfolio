import { useCallback, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './sections/About'
import { TechStack } from './sections/TechStack'
import { Gallery } from './sections/Gallery'
import { Contact } from './sections/Contact'
import { Footer } from './components/Footer'
import { CinematicPreloader } from './components/CinematicPreloader'

function App() {
  const [introDone, setIntroDone] = useState(false)
  const handleDone = useCallback(() => setIntroDone(true), [])

  return (
    <div className="bg-[var(--bg)] text-white min-h-screen overflow-x-clip">
      {!introDone && <CinematicPreloader onDone={handleDone} />}
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App

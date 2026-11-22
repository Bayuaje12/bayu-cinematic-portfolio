import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './sections/About'
import { TechStack } from './sections/TechStack'
import { Gallery } from './sections/Gallery'
import { Contact } from './sections/Contact'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="bg-[var(--bg)] text-white min-h-screen overflow-x-clip">
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

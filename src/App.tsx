import { MotionConfig } from 'motion/react'
import { About } from './components/About'
import { Catalog } from './components/Catalog'
import { Contact } from './components/Contact'
import { ContactForm } from './components/ContactForm'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Navbar } from './components/Navbar'
import { SelectionPanel } from './components/SelectionPanel'
import { Toaster } from './components/Toaster'
import { WhyWebTix } from './components/WhyWebTix'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#obsah"
        className="fixed left-3 top-3 z-[80] -translate-y-20 rounded-full bg-accent-strong px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
      >
        Přeskočit na obsah
      </a>
      <Navbar />
      <main id="obsah">
        <Hero />
        <HowItWorks />
        <Catalog />
        <ContactForm />
        <About />
        <WhyWebTix />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <SelectionPanel />
      <Toaster />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  )
}

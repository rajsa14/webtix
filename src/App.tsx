import { MotionConfig } from 'motion/react'
import { About } from './components/About'
import { Catalog } from './components/Catalog'
import { Contact } from './components/Contact'
import { Cursor } from './components/Cursor'
import { Marquee } from './components/Decor'
import { ContactForm } from './components/ContactForm'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Navbar } from './components/Navbar'
import { Playground } from './components/Playground'
import { References } from './components/References'
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
        <div className="overflow-hidden py-6">
          <Marquee
            items={['Weby na míru', 'Žádné šablony', 'Přímo s tvůrci', 'Design i vývoj', 'Rychlé a responzivní']}
            className="-mx-[3%] w-[106%] -rotate-[1.2deg] bg-fg py-5 font-display text-[clamp(1.8rem,4vw,3.4rem)] font-extrabold tracking-[-0.04em] text-ink-950"
          />
        </div>
        <Playground />
        <HowItWorks />
        <Catalog />
        <ContactForm />
        <References />
        <About />
        <WhyWebTix />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <SelectionPanel />
      <Toaster />
      <Cursor />
    </MotionConfig>
  )
}

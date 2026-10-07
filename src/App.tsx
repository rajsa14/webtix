import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
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
import { Intro } from './components/Intro'
import { Navbar } from './components/Navbar'
import { Playground } from './components/Playground'
import { References } from './components/References'
import { ScrollProgress } from './components/ScrollProgress'
import { SelectionPanel } from './components/SelectionPanel'
import { Services } from './components/Services'
import { Toaster } from './components/Toaster'
import { WhyWebTix } from './components/WhyWebTix'
import { useT } from './i18n'

export default function App() {
  const t = useT()

  // Keep the tab title and description in the visitor's language.
  useEffect(() => {
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [t])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#obsah"
        className="fixed left-3 top-3 z-[80] -translate-y-20 rounded-full bg-accent-strong px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
      >
        {t.skip}
      </a>
      <Intro />
      <ScrollProgress />
      <Navbar />
      <main id="obsah">
        <Hero />
        <div className="overflow-hidden py-6">
          <Marquee
            items={t.marquee}
            className="-mx-[3%] w-[106%] -rotate-[1.2deg] bg-fg py-5 font-display text-[clamp(1.8rem,4vw,3.4rem)] font-extrabold tracking-[-0.04em] text-ink-950"
          />
        </div>
        <Playground />
        <HowItWorks />
        <Catalog />
        <ContactForm />
        <References />
        <Services />
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

import { useEffect, type ReactNode } from 'react'
import { ContactForm } from './components/ContactForm'
import { CookieBanner } from './components/CookieBanner'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Hero } from './components/home/Hero'
import { HowWeWork } from './components/home/HowWeWork'
import { Price } from './components/home/Price'
import { RealProposal } from './components/home/RealProposal'
import { Team } from './components/home/Team'
import { Navbar } from './components/Navbar'
import { InquirySent } from './components/pages/InquirySent'
import { LegalPage } from './components/pages/LegalPage'
import { NotFound } from './components/pages/NotFound'
import { PAGES } from './data/site'
import { usePageMeta } from './lib/meta'
import { useRevealAll } from './lib/motion'
import { startSmoothScroll } from './lib/smoothScroll'
import { usePath } from './lib/router'

/** Sets the browser title and description of a page, then shows its sections. */
function Titled({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  usePageMeta({ title, description })
  return children
}

/** Every address and what it shows. The header and footer stay the same around it. */
const ROUTES: Record<string, () => ReactNode> = {
  // The homepage, in the design's order. The enquiry form is the "Poptávka" section.
  [PAGES.home]: () => (
    <Titled>
      <Hero />
      <HowWeWork />
      <RealProposal />
      <Team />
      <Price />
      <ContactForm />
    </Titled>
  ),
  [PAGES.inquirySent]: () => <InquirySent />,
  [PAGES.privacy]: () => <LegalPage doc="privacy" />,
  [PAGES.terms]: () => <LegalPage doc="terms" />,
}

export default function App() {
  const path = usePath()
  const page = ROUTES[path] ?? (() => <NotFound />)
  useRevealAll(path)
  useEffect(() => startSmoothScroll(), [])

  return (
    <>
      <a
        href="#obsah"
        className="fixed left-3 top-3 z-[80] -translate-y-20 rounded-card bg-ink px-4 py-2 text-sm font-medium text-paper focus:translate-y-0"
      >
        Přeskočit na obsah
      </a>
      {/* On the homepage the hero places the header itself. */}
      {path !== PAGES.home && (
        <div className="container-x">
          <Navbar variant="desktop" className="hidden lg:flex" />
          <Navbar variant="phone" className="-mx-4 lg:hidden" />
        </div>
      )}
      <main key={path} id="obsah" tabIndex={-1} className="min-h-[70dvh] outline-none">
        {page()}
      </main>
      <Footer />
      <CookieBanner />
      <Cursor />
    </>
  )
}

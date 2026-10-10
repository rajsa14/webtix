import { MotionConfig, motion } from 'motion/react'
import { lazy, Suspense, type ReactNode } from 'react'
import { About } from './components/About'
import { Catalog } from './components/Catalog'
import { Contact } from './components/Contact'
import { ContactForm } from './components/ContactForm'
import { CookieBanner } from './components/CookieBanner'
import { Cursor } from './components/Cursor'
import { Marquee } from './components/Decor'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HomeLinks } from './components/HomeLinks'
import { HowItWorks } from './components/HowItWorks'
import { Navbar } from './components/Navbar'
import { InquirySent } from './components/pages/InquirySent'
import { LegalPage } from './components/pages/LegalPage'
import { NotFound } from './components/pages/NotFound'
import { Playground } from './components/Playground'
import { References } from './components/References'
import { EASE } from './components/Reveal'
import { SelectionPanel } from './components/SelectionPanel'
import { Toaster } from './components/Toaster'
import { WhyWebTix } from './components/WhyWebTix'
import { PAGES, SITE } from './data/site'
import { usePageMeta } from './lib/meta'
import { usePath } from './lib/router'

// The dashboard is only for the team, so visitors never download it.
const Admin = lazy(() => import('./components/pages/Admin'))

/** Sets the browser title and description of a page, then shows its sections. */
function Titled({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  usePageMeta({ title, description })
  return children
}

/** Every address and what it shows. The header, footer and selection stay the same around it. */
const ROUTES: Record<string, () => ReactNode> = {
  [PAGES.home]: () => (
    <Titled>
      <Hero />
      <div className="overflow-hidden py-6">
        <Marquee
          items={['Weby na míru', 'Žádné šablony', 'Přímo s tvůrci', 'Design i vývoj', 'Rychlé a responzivní']}
          className="-mx-[3%] w-[106%] -rotate-[1.2deg] bg-fg py-5 font-display text-[clamp(1.8rem,4vw,3.4rem)] font-extrabold tracking-[-0.04em] text-ink-950"
        />
      </div>
      <HomeLinks />
      <Playground />
      <Contact />
    </Titled>
  ),
  [PAGES.catalog]: () => (
    <Titled
      title="Katalog"
      description="Vyberte si písmo, barvy, fotky, styl, tlačítka a layout svého webu. Z vašeho výběru připravíme návrh."
    >
      <Catalog />
    </Titled>
  ),
  [PAGES.process]: () => (
    <Titled
      title="Jak to funguje"
      description="Od první inspirace po hotový web ve čtyřech krocích. Proč si vybrat WebTix a odpovědi na časté otázky."
    >
      <HowItWorks />
      <WhyWebTix />
      <FAQ />
      <Contact />
    </Titled>
  ),
  [PAGES.references]: () => (
    <Titled title="Reference" description="Ukázky webů a konceptů, které studio WebTix navrhlo a postavilo.">
      <References />
      <Contact />
    </Titled>
  ),
  [PAGES.about]: () => (
    <Titled title="O nás" description="Kdo stojí za studiem WebTix: Richard Buchníček a Daniel Švéda.">
      <About />
      <Contact />
    </Titled>
  ),
  [PAGES.contact]: () => (
    <Titled
      title="Kontakt"
      description={`Pošlete nám svou představu o webu. Odpovíme s ukázkou a nabídkou. Napsat můžete i na ${SITE.email}.`}
    >
      <ContactForm />
    </Titled>
  ),
  [PAGES.inquirySent]: () => <InquirySent />,
  [PAGES.privacy]: () => <LegalPage doc="privacy" />,
  [PAGES.terms]: () => <LegalPage doc="terms" />,
  [PAGES.admin]: () => (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  ),
}

export default function App() {
  const path = usePath()
  const page = ROUTES[path] ?? (() => <NotFound />)
  const isAdmin = path === PAGES.admin

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#obsah"
        className="fixed left-3 top-3 z-[80] -translate-y-20 rounded-full bg-accent-strong px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
      >
        Přeskočit na obsah
      </a>
      <Navbar />
      {/* Keyed by address, so each page fades in fresh. */}
      <motion.main
        key={path}
        id="obsah"
        tabIndex={-1}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="min-h-[70dvh] outline-none"
      >
        {page()}
      </motion.main>
      <Footer />
      {!isAdmin && <SelectionPanel />}
      {!isAdmin && <CookieBanner />}
      <Toaster />
      <Cursor />
    </MotionConfig>
  )
}

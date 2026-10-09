import { ArrowLeftIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { SITE } from '../../data/site'
import { Footer } from '../Footer'
import { Logo } from '../Logo'

/** Frame for standalone pages: slim header, content, the shared footer. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="px-3 pt-3 sm:px-5">
        <nav
          aria-label="Hlavní navigace"
          className="mx-auto flex h-14 max-w-[1240px] items-center justify-between rounded-full border border-line-strong bg-ink-900 pl-5 pr-2 sm:h-16"
        >
          <a href="/" className="shrink-0 rounded-full" aria-label={`${SITE.name}, úvodní stránka`}>
            <Logo />
          </a>
          <a
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14.5px] text-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
          >
            <ArrowLeftIcon size={16} weight="bold" />
            Zpět na web
          </a>
        </nav>
      </header>
      <main id="obsah">{children}</main>
      <Footer />
    </>
  )
}

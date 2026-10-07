import { team } from '../data/team'
import { useLang, useT } from '../i18n'
import { cx, nb } from '../lib/text'
import { LogoMark } from './Logo'
import { Reveal } from './Reveal'

const BACKDROPS = ['bg-accent text-white', 'bg-fg text-ink-950']

export function Team() {
  const t = useT()
  const lang = useLang((s) => s.lang)
  return (
    <div className="mt-20 sm:mt-28">
      <Reveal>
        <h3 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.05em]">{t.team.title}</h3>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:gap-5">
        {team.map((member, i) => {
          const text = lang === 'en' ? member.en : member
          return (
          <Reveal key={member.name} delay={i * 0.1}>
            <article
              className="group h-full overflow-hidden rounded-card border border-fg bg-ink-900"
            >
              <div className="relative aspect-[16/11] overflow-hidden border-b border-fg bg-ink-800">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={`${member.name}, ${text.role}, WebTix`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className={cx('absolute inset-0', BACKDROPS[i % BACKDROPS.length])}>
                    <span className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">{t.team.photoSoon}</span>
                    <LogoMark mono className="absolute right-6 top-6 h-6 w-auto" />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[-0.12em] left-5 font-display text-[clamp(7rem,16vw,12rem)] font-bold leading-none tracking-[-0.06em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2"
                    >
                      {member.initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
                <h4 className="text-[2.2rem] font-extrabold leading-[0.95] tracking-[-0.05em]">{member.name}</h4>
                <p className="mt-1 text-[15px] text-muted">
                  WebTix <span aria-hidden="true" className="px-1 text-faint">/</span> {text.role}
                </p>
                <p className="mt-5 max-w-md leading-relaxed text-muted">{nb(text.description)}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={t.team.focusAria}>
                  {text.focus.map((f) => (
                    <li key={f} className="rounded-full border border-fg px-3 py-1 text-[13px] text-fg">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
          )
        })}
      </div>
    </div>
  )
}

import { team } from '../data/team'
import { spotlightMove } from '../lib/hooks'
import { cx, nb } from '../lib/text'
import { LogoMark } from './Logo'
import { Reveal } from './Reveal'

const BACKDROPS = [
  'bg-[radial-gradient(120%_90%_at_15%_0%,rgb(79_107_255/0.55),transparent_55%),radial-gradient(80%_70%_at_100%_100%,rgb(14_159_184/0.22),transparent_60%)]',
  'bg-[radial-gradient(120%_90%_at_85%_0%,rgb(79_107_255/0.5),transparent_55%),radial-gradient(80%_70%_at_0%_100%,rgb(143_160_255/0.2),transparent_60%)]',
]

export function Team() {
  return (
    <div className="mt-20 sm:mt-28">
      <Reveal>
        <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.025em]">Náš tým</h3>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:gap-5">
        {team.map((member, i) => (
          <Reveal key={member.name} delay={i * 0.1}>
            <article
              onPointerMove={spotlightMove}
              className="spotlight group h-full overflow-hidden rounded-card border border-line bg-ink-900 transition-colors duration-500 hover:border-line-strong"
            >
              <div className="relative m-1.5 aspect-[16/11] overflow-hidden rounded-[15px] bg-ink-800">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={`${member.name}, ${member.role} WebTix`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className={cx('absolute inset-0', BACKDROPS[i % BACKDROPS.length])}>
                    <LogoMark className="absolute right-6 top-6 h-6 w-auto opacity-80" />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[-0.12em] left-5 font-display text-[clamp(7rem,16vw,12rem)] font-bold leading-none tracking-[-0.06em] text-white/90 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2"
                    >
                      {member.initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
                <h4 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.025em]">{member.name}</h4>
                <p className="mt-1 text-[15px] text-muted">
                  WebTix <span aria-hidden="true" className="px-1 text-faint">/</span> {member.role}
                </p>
                <p className="mt-5 max-w-md leading-relaxed text-muted">{nb(member.description)}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Zaměření">
                  {member.focus.map((f) => (
                    <li key={f} className="rounded-full border border-line-strong px-3 py-1 text-[13px] text-fg/90">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

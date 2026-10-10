import { team } from '../../data/team'
import { revealDelay } from '../../lib/motion'
import { cx, nb } from '../../lib/text'

/*
 * "Kdo jsme": the two of us. Built from docs/design/source/Rest.dc.html (1440)
 * and RestMobile.dc.html (390). Portraits come from src/data/team.ts.
 */

export function Team() {
  return (
    <section id="kdo-jsme" aria-labelledby="kdo-title" className="container-x py-24 lg:py-40">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
        <div data-reveal className="flex flex-col lg:col-span-5">
          <p className="mono m-0 mb-4 text-[11px] text-muted lg:mb-6 lg:text-[12px]">Kdo jsme</p>
          <h2
            id="kdo-title"
            className="m-0 mb-5 text-[40px] leading-[0.96] tracking-[-0.035em] lg:mb-8 lg:text-[clamp(44px,4.4444vw,64px)] lg:leading-[0.95]"
          >
            Dva lidé. Mluvíte <em className="italic text-terracotta">přímo</em> s&nbsp;námi.
          </h2>
          <p className="m-0 max-w-[420px] text-[16px] leading-6 text-ink-soft lg:text-[18px] lg:leading-7">
            {/* The phone copy drops the first sentence. */}
            <span className="hidden lg:inline">Žádný account manager. </span>Kdo váš web navrhne, ten vám ho taky ukáže.
          </p>
        </div>

        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:col-span-6 lg:col-start-7 lg:gap-6">
          {team.map((member, i) => (
            <li key={member.name} data-reveal style={revealDelay(i + 1, 150)} className={cx('flex flex-col gap-3 lg:gap-4', i === 1 && 'mt-10 lg:mt-16')}>
              <div className="flex aspect-[4/5] flex-col overflow-hidden rounded-card border-2 border-solid border-ink bg-white">
                {/* The name follows right below, so the portrait needs no text of its own. */}
                <img
                  src={import.meta.env.BASE_URL + member.portrait}
                  alt=""
                  width={200}
                  height={250}
                  loading="lazy"
                  decoding="async"
                  className="mt-auto block h-auto w-full"
                />
              </div>
              <div>
                <h3 className="m-0 text-[17px] leading-[22px] lg:text-[22px] lg:leading-7">{member.name}</h3>
                <p className="m-0 mt-0.5 text-[14px] leading-5 text-ink-soft lg:mt-1 lg:text-[16px] lg:leading-6">{nb(member.bio)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

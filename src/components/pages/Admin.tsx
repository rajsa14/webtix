import { SignOutIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { usePageMeta } from '../../lib/meta'
import { cx, nb } from '../../lib/text'

interface Day {
  date: string
  views: number
  visitors: number
  inquiries: number
}

interface Stats {
  days: Day[]
  totals: { views: number; visitors: number; inquiries: number }
  pages: [string, number][]
  referrers: [string, number][]
  devices: [string, number][]
}

type View = { state: 'loading' } | { state: 'login' } | { state: 'off' } | { state: 'ready'; stats: Stats }

const RANGES = [7, 30, 90] as const
const PAGE_NAMES: Record<string, string> = {
  '/': 'Úvodní stránka',
  '/katalog': 'Katalog',
  '/jak-to-funguje': 'Jak to funguje',
  '/reference': 'Reference',
  '/o-nas': 'O nás',
  '/kontakt': 'Kontakt',
  '/ochrana-osobnich-udaju': 'Ochrana osobních údajů',
  '/obchodni-podminky': 'Obchodní podmínky',
}

const number = new Intl.NumberFormat('cs-CZ')
const dayLabel = (date: string) => `${Number(date.slice(8))}. ${Number(date.slice(5, 7))}.`

/** Private dashboard at /admin. Everything it shows comes from netlify/functions/admin.mts. */
export default function Admin() {
  usePageMeta({ title: 'Přehled', noindex: true })
  const [view, setView] = useState<View>({ state: 'loading' })
  const [range, setRange] = useState<(typeof RANGES)[number]>(30)

  const load = useCallback(async (days: number) => {
    try {
      const res = await fetch(`/api/admin/stats?days=${days}`)
      if (res.ok) setView({ state: 'ready', stats: await res.json() })
      else setView({ state: res.status === 401 ? 'login' : 'off' })
    } catch {
      setView({ state: 'off' })
    }
  }, [])

  useEffect(() => {
    void load(range)
  }, [load, range])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setView({ state: 'login' })
  }

  return (
    <>
      <div className="container-x pb-12 pt-28 sm:pb-16 sm:pt-32">
        {view.state === 'loading' && <p className="py-24 text-center text-muted">Načítám…</p>}
        {view.state === 'off' && (
          <p className="mx-auto max-w-md py-24 text-center leading-relaxed text-muted">
            {nb('Přehled teď není dostupný. Zkontrolujte, že je v Netlify nastavená proměnná ADMIN_PASSWORD a web je znovu nasazený.')}
          </p>
        )}
        {view.state === 'login' && <Login onDone={() => load(range)} />}
        {view.state === 'ready' && (
          <Dashboard stats={view.stats} range={range} onRange={setRange} onLogout={logout} />
        )}
      </div>
    </>
  )
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password) return setError('Zadejte heslo.')
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) return onDone()
      setError(
        res.status === 429
          ? 'Příliš mnoho pokusů. Zkuste to za minutu.'
          : res.status === 401
            ? 'Nesprávné heslo.'
            : 'Přihlášení se nepovedlo. Zkuste to znovu.',
      )
    } catch {
      setError('Přihlášení se nepovedlo. Zkontrolujte připojení.')
    }
    setBusy(false)
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-sm rounded-card border border-line bg-ink-900 p-6 sm:p-8">
      <h1 className="text-[1.9rem] font-semibold tracking-[-0.025em]">Přihlášení</h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">Přehled návštěvnosti je jen pro tým WebTix.</p>
      <label htmlFor="admin-password" className="mb-2 mt-6 block text-[14px] font-medium text-fg">
        Heslo
      </label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'admin-error' : undefined}
        className={cx(
          'h-12 w-full rounded-[12px] border bg-ink-850 px-4 text-[15.5px] text-fg outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:ring-4 focus:ring-accent/20',
          error ? 'border-danger/70' : 'border-line-strong',
        )}
      />
      <p id="admin-error" role="alert" className="text-[13px] text-danger">
        {error && (
          <span className="mt-2 flex items-start gap-1.5">
            <WarningCircleIcon size={15} weight="fill" className="mt-px shrink-0" />
            {error}
          </span>
        )}
      </p>
      <button
        type="submit"
        disabled={busy}
        className="mt-6 h-12 w-full rounded-full bg-fg font-medium text-ink-950 transition-colors duration-300 hover:bg-accent hover:text-white disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? 'Přihlašuji…' : 'Přihlásit se'}
      </button>
    </form>
  )
}

function Dashboard({
  stats,
  range,
  onRange,
  onLogout,
}: {
  stats: Stats
  range: number
  onRange: (range: (typeof RANGES)[number]) => void
  onLogout: () => void
}) {
  const card = 'rounded-card border border-line bg-ink-900 p-5 sm:p-6'

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.035em]">Přehled</h1>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Období" className="flex rounded-full border border-line-strong p-1">
            {RANGES.map((days) => (
              <button
                key={days}
                type="button"
                aria-pressed={range === days}
                onClick={() => onRange(days)}
                className={cx(
                  'h-9 rounded-full px-3.5 text-[14px] transition-colors',
                  range === days ? 'bg-fg text-ink-950' : 'text-muted hover:text-fg',
                )}
              >
                {days} dní
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] text-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
          >
            <SignOutIcon size={16} />
            Odhlásit
          </button>
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Zobrazení stránek', value: stats.totals.views },
          { label: 'Návštěvníci se souhlasem', value: stats.totals.visitors },
          { label: 'Odeslané poptávky', value: stats.totals.inquiries },
        ].map((tile) => (
          <div key={tile.label} className={card}>
            <dt className="text-[14px] text-muted">{tile.label}</dt>
            <dd className="mt-2 font-display text-[2.6rem] font-semibold leading-none tracking-[-0.03em]">
              {number.format(tile.value)}
            </dd>
          </div>
        ))}
      </dl>

      <section className={cx(card, 'mt-4')}>
        <h2 className="font-sans text-[15px] font-semibold">Zobrazení po dnech</h2>
        <DailyChart days={stats.days} />
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Ranking title="Stránky" rows={stats.pages.map(([path, count]) => [PAGE_NAMES[path] ?? path, count])} />
        <Ranking title="Odkud přišli" rows={stats.referrers} empty="Zatím jen přímé návštěvy." />
        <Ranking title="Zařízení" rows={stats.devices} />
      </div>

      <details className={cx(card, 'mt-4')}>
        <summary className="cursor-pointer text-[15px] font-semibold">Tabulka po dnech</summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-[14px]">
            <thead className="text-muted">
              <tr>
                {['Den', 'Zobrazení', 'Návštěvníci', 'Poptávky'].map((heading) => (
                  <th key={heading} scope="col" className="border-b border-line py-2 pr-4 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {stats.days.toReversed().map((day) => (
                <tr key={day.date}>
                  <th scope="row" className="border-b border-line py-2 pr-4 font-normal">
                    {dayLabel(day.date)}
                  </th>
                  <td className="border-b border-line py-2 pr-4">{day.views}</td>
                  <td className="border-b border-line py-2 pr-4">{day.visitors}</td>
                  <td className="border-b border-line py-2 pr-4">{day.inquiries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-muted">
        {nb('Zobrazení se počítají u všech návštěv. Návštěvníky umíme rozlišit jen u lidí, kteří povolili statistiky, takže jejich skutečný počet je vyšší.')}
      </p>
    </>
  )
}

/** One series, one colour: bar height is views that day. Details on hover or focus. */
function DailyChart({ days }: { days: Day[] }) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(1, ...days.map((d) => d.views))
  const shown = active === null ? null : days[active]
  // Roughly six date labels, whatever the range.
  const labelEvery = Math.ceil(days.length / 6)

  return (
    <div className="mt-4">
      <p className="h-5 text-[13px] text-muted" aria-live="polite">
        {shown
          ? `${dayLabel(shown.date)} · ${shown.views} zobrazení · ${shown.visitors} návštěvníků · ${shown.inquiries} poptávek`
          : `Nejvíc za den: ${number.format(max === 1 && !days.some((d) => d.views) ? 0 : max)}`}
      </p>
      <div
        className="mt-3 flex h-44 items-end gap-[2px] border-b border-line-strong"
        onPointerLeave={() => setActive(null)}
      >
        {days.map((day, i) => (
          <button
            key={day.date}
            type="button"
            aria-label={`${dayLabel(day.date)}: ${day.views} zobrazení`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className="group flex h-full min-w-0 flex-1 items-end rounded-none outline-offset-0"
          >
            <span
              className={cx(
                'w-full rounded-t-[4px] transition-colors',
                active === i ? 'bg-accent-soft' : 'bg-accent',
                !day.views && 'bg-fg/10',
              )}
              style={{ height: day.views ? `${Math.max(3, (day.views / max) * 100)}%` : '2px' }}
            />
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-[2px] text-[12px] text-muted" aria-hidden="true">
        {days.map((day, i) => (
          <span key={day.date} className="min-w-0 flex-1 whitespace-nowrap">
            {i % labelEvery === 0 && dayLabel(day.date)}
          </span>
        ))}
      </div>
    </div>
  )
}

function Ranking({ title, rows, empty = 'Zatím žádná data.' }: { title: string; rows: [string, number][]; empty?: string }) {
  const max = Math.max(1, ...rows.map(([, count]) => count))
  return (
    <section className="rounded-card border border-line bg-ink-900 p-5 sm:p-6">
      <h2 className="font-sans text-[15px] font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-[14px] text-muted">{empty}</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {rows.map(([label, count]) => (
            <li key={label}>
              <div className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className="truncate text-fg/90">{label}</span>
                <span className="tabular-nums text-muted">{number.format(count)}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-fg/[0.08]">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

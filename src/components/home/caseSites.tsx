import type { CSSProperties, ReactNode } from 'react'
import { SCREEN } from '../../data/cases'

/*
 * The mini sites of the "Návrhy" deck, drawn at phone-screen size (206 × 446).
 * Each invented business has its own problem on the old site and its own,
 * distinct new site that fixes exactly that problem: different layout, type
 * and colour, so they never look like one template. Pictures are drawn
 * (simple SVG scenes), not stock or generated photos. All aria-hidden: the
 * deck describes each case in text.
 */

const ARCHIVO = "'Archivo Variable','Archivo','Arial Narrow',sans-serif"
const SANS = "'Instrument Sans','Helvetica Neue',Arial,sans-serif"
const SERIF = "Georgia,'Times New Roman',serif"
const MONO = "'JetBrains Mono',ui-monospace,monospace"
const TIMES = "'Times New Roman',Times,serif"

function Screen({ bg, color, font, children, style }: { bg: string; color: string; font: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div aria-hidden="true" style={{ position: 'relative', width: SCREEN.w, height: SCREEN.h, background: bg, color, fontFamily: font, overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}

/* ---------- Vlnka, hair salon: booking only by phone → slot picker ---------- */

export function VlnkaOld() {
  return (
    <Screen bg="#FFFFFF" color="#444" font={SERIF}>
      <div style={{ background: '#F3C6D6', padding: '14px 10px 10px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 24, fontStyle: 'italic', color: '#8E2B6E' }}>Vlnka</p>
        <p style={{ margin: '2px 0 0', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8E2B6E' }}>kadeřnický salon</p>
      </div>
      <div style={{ margin: '12px auto 0', width: 150, height: 92, borderRadius: '50%', background: '#F7E1EA', display: 'grid', placeItems: 'center', fontSize: 8, color: '#C48AA4' }}>
        ✂
      </div>
      <p style={{ margin: '14px 14px 0', fontSize: 9.5, lineHeight: '14px', textAlign: 'center' }}>
        Objednávky přijímáme <b>pouze telefonicky</b> v pracovní dny od 8:00 do 16:00.
      </p>
      <p style={{ margin: '12px 0 0', textAlign: 'center', fontFamily: 'Arial', fontSize: 19, fontWeight: 700, color: '#D0021B' }}>☎ 585 000 000</p>
      <p style={{ margin: '10px 14px 0', fontSize: 8, textAlign: 'center', color: '#999' }}>Online objednávky nejsou možné. Děkujeme za pochopení.</p>
      <p style={{ margin: '18px 14px 0', fontSize: 8, textAlign: 'center', color: '#999' }}>Mimo pracovní dobu nás prosím nekontaktujte.</p>
    </Screen>
  )
}

export function VlnkaNew() {
  const slots: [string, 'busy' | 'free' | 'pick'][] = [
    ['9:00', 'busy'],
    ['10:30', 'pick'],
    ['11:15', 'free'],
    ['13:00', 'busy'],
    ['14:45', 'free'],
    ['16:30', 'free'],
  ]
  return (
    <Screen bg="#0E0E0E" color="#FFFFFF" font={SANS}>
      <div style={{ padding: '14px 12px 0' }}>
        <p style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontStretch: '62%', fontSize: 46, lineHeight: 0.82, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
          Vlnka
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 9, color: '#FF6FAE', fontWeight: 600 }}>Střih bez čekání · Olomouc</p>
      </div>
      <div style={{ margin: '14px 12px 0', display: 'flex', gap: 5 }}>
        {['Čt 12', 'Pá 13', 'So 14'].map((d, i) => (
          <span key={d} style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 8, fontSize: 9, fontWeight: 700, background: i === 0 ? '#FFFFFF' : '#1E1E1E', color: i === 0 ? '#0E0E0E' : '#BBB' }}>
            {d}
          </span>
        ))}
      </div>
      <p style={{ margin: '14px 12px 6px', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>Volné termíny · Petra</p>
      <div style={{ margin: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
        {slots.map(([t, s]) => (
          <span
            key={t}
            style={{
              padding: '8px 0',
              textAlign: 'center',
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 700,
              border: s === 'pick' ? 'none' : '1px solid #333',
              background: s === 'pick' ? '#FF6FAE' : 'transparent',
              color: s === 'busy' ? '#555' : s === 'pick' ? '#0E0E0E' : '#FFFFFF',
              textDecoration: s === 'busy' ? 'line-through' : 'none',
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <p style={{ margin: '14px 12px 6px', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>Kadeřnice</p>
      <div style={{ margin: '0 12px', display: 'flex', gap: 8 }}>
        {['Petra', 'Míša', 'Jana'].map((n, i) => (
          <span key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontSize: 7.5, color: i === 0 ? '#FFFFFF' : '#888' }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontSize: 11,
                fontWeight: 800,
                background: ['#FF6FAE', '#3A3A3A', '#2A2A2A'][i],
                color: i === 0 ? '#0E0E0E' : '#CCC',
                outline: i === 0 ? '2px solid #FFFFFF' : 'none',
                outlineOffset: 2,
              }}
            >
              {n[0]}
            </span>
            {n}
          </span>
        ))}
      </div>
      <div style={{ margin: '14px 12px 0', padding: 10, borderRadius: 10, background: '#1A1A1A', display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
        <span>Dámský střih</span>
        <b>650 Kč · 60 min</b>
      </div>
      <p style={{ margin: '8px 12px 0', fontSize: 7.5, color: '#888' }}>Potvrzení přijde hned v SMS. Zrušit jde jedním klepnutím.</p>
      <span style={{ position: 'absolute', left: 12, right: 12, bottom: 14, padding: '12px 0', borderRadius: 999, background: '#FF6FAE', color: '#0E0E0E', textAlign: 'center', fontSize: 11, fontWeight: 800 }}>
        Rezervovat čtvrtek 10:30
      </span>
    </Screen>
  )
}

/* ---------- Hoblík, carpenter: text only → photo-led portfolio ---------- */

export function HoblikOld() {
  return (
    <Screen bg="#FFFFFF" color="#222" font={TIMES}>
      <p style={{ margin: '14px 12px 0', fontSize: 15, fontWeight: 700 }}>Truhlářství Hoblík</p>
      <hr style={{ margin: '6px 12px', border: 0, borderTop: '1px solid #999' }} />
      <p style={{ margin: '0 12px', fontSize: 8, lineHeight: '11px', textAlign: 'justify' }}>
        Naše firma působí v oboru truhlářské výroby již od roku 1994. Zabýváme se výrobou nábytku na zakázku dle přání zákazníka, a to zejména kuchyňských linek,
        vestavěných skříní, schodišť, stolů, postelí a dalšího interiérového vybavení. Při výrobě používáme kvalitní materiály od prověřených dodavatelů. Ke každé
        zakázce přistupujeme individuálně a klademe důraz na kvalitu a preciznost provedení. Zaměření a cenová nabídka zdarma.
      </p>
      <p style={{ margin: '8px 12px 0', fontSize: 8, lineHeight: '11px' }}>
        Vyrábíme:
        <br />• kuchyňské linky • vestavěné skříně
        <br />• schodiště • stoly a židle • postele
        <br />• dveře • obklady • a další dle dohody
      </p>
      <p style={{ margin: '12px 12px 0', fontSize: 8.5, fontStyle: 'italic', color: '#666' }}>Fotogalerie se připravuje.</p>
      <p style={{ margin: '12px 12px 0', fontSize: 8, lineHeight: '11px' }}>
        Kontakt: Jihlava, tel. 567 000 000, e-mail: hoblik@email.cz. Provozní doba po dohodě.
      </p>
    </Screen>
  )
}

function Kitchen() {
  return (
    <svg viewBox="0 0 206 190" width="206" height="190" style={{ display: 'block' }}>
      <rect width="206" height="190" fill="#EDE3D2" />
      <rect x="128" y="18" width="56" height="62" rx="3" fill="#CFE0E8" />
      <path d="M156 18v62M128 49h56" stroke="#EDE3D2" strokeWidth="3" />
      <rect x="12" y="20" width="96" height="40" rx="2" fill="#B88A5A" />
      <path d="M44 20v40M76 20v40" stroke="#9C7148" strokeWidth="2" />
      <rect x="0" y="112" width="206" height="10" fill="#3B2E25" />
      <rect x="0" y="122" width="206" height="68" fill="#C49A68" />
      <path d="M52 122v68M104 122v68M156 122v68" stroke="#A47B4E" strokeWidth="2" />
      <path d="M40 150h8M92 150h8M144 150h8M196 150h6" stroke="#3B2E25" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="138" y="94" width="18" height="18" rx="2" fill="#5E7A55" />
    </svg>
  )
}

export function HoblikNew() {
  const tiles: [string, string][] = [
    ['#8C6A47', 'Skříň · ořech'],
    ['#5E7A55', 'Schody · buk'],
    ['#B88A5A', 'Stůl · dub'],
    ['#6E5A47', 'Knihovna'],
  ]
  return (
    <Screen bg="#F4EFE6" color="#1F2A1E" font={SANS}>
      <div style={{ position: 'relative' }}>
        <Kitchen />
        <span style={{ position: 'absolute', left: 10, top: 10, fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', color: '#1F2A1E' }}>Hoblík</span>
        <span style={{ position: 'absolute', left: 10, bottom: 10, padding: '4px 7px', borderRadius: 6, background: '#1F2A1E', color: '#F4EFE6', fontFamily: MONO, fontSize: 7 }}>
          Kuchyně · dub masiv · 2025
        </span>
      </div>
      <p style={{ margin: '12px 12px 0', fontSize: 17, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>Nábytek na míru, ne z katalogu.</p>
      <div style={{ margin: '10px 12px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {tiles.map(([c, t]) => (
          <div key={t}>
            <span style={{ display: 'block', height: 52, borderRadius: 6, background: c }} />
            <span style={{ display: 'block', marginTop: 3, fontFamily: MONO, fontSize: 6.5, color: '#55604F' }}>{t}</span>
          </div>
        ))}
      </div>
      <span style={{ position: 'absolute', left: 12, right: 12, bottom: 12, padding: '10px 0', borderRadius: 6, background: '#3E6B3A', color: '#F4EFE6', textAlign: 'center', fontSize: 10, fontWeight: 700 }}>
        Poslat rozměry → nabídka do 3 dnů
      </span>
    </Screen>
  )
}

/* ---------- U Tří buků, guesthouse: desktop page on a phone → mobile-first ---------- */

export function BukyOld() {
  // A desktop page shrunk onto the phone: tiny text, three columns, cut off on the right.
  return (
    <Screen bg="#DDE6F0" color="#222" font={TIMES}>
      <div style={{ width: 320, transform: 'scale(0.78)', transformOrigin: '0 0' }}>
        <div style={{ background: '#1D3F7A', color: '#fff', padding: '8px 10px', fontSize: 14, fontWeight: 700 }}>Penzion U Tří buků – ubytování Krkonoše</div>
        <div style={{ background: '#C9D6E6', padding: '3px 10px', fontSize: 6.5, color: '#1D3F7A' }}>Úvod | Pokoje | Ceník 2019 | Okolí | Fotogalerie | Rezervace | Kontakt | Kniha návštěv</div>
        <div style={{ display: 'flex', gap: 6, padding: 8 }}>
          {[0, 1, 2].map((c) => (
            <div key={c} style={{ flex: 1, background: '#fff', border: '1px solid #9AB', padding: 5, fontSize: 5.5, lineHeight: '7.5px' }}>
              <b style={{ fontSize: 6.5 }}>{['Pokoje', 'Ceník', 'Rezervace'][c]}</b>
              <br />
              {[
                'Dvoulůžkové a třílůžkové pokoje s vlastním sociálním zařízením, TV a výhledem na hory.',
                'Dvoulůžkový pokoj 850 Kč/os./noc, přistýlka 400 Kč, pes 150 Kč, snídaně 120 Kč.',
                'Rezervace e-mailem. Uveďte termín, počet osob a pokoj. Odpovíme do týdne.',
              ][c]}
            </div>
          ))}
        </div>
        <div style={{ margin: '0 8px', height: 120, background: '#9DB4CC', display: 'grid', placeItems: 'center', fontSize: 6, color: '#456' }}>foto_penzion_zima.jpg</div>
        <p style={{ margin: '6px 8px', fontSize: 5.5 }}>Stránky jsou optimalizovány pro rozlišení 1280 × 1024.</p>
      </div>
      {/* The sideways scrollbar of a page wider than the screen. */}
      <div style={{ position: 'absolute', left: 4, right: 4, bottom: 6, height: 5, borderRadius: 3, background: '#B8C4D2' }}>
        <div style={{ width: '58%', height: '100%', borderRadius: 3, background: '#7C8A9A' }} />
      </div>
    </Screen>
  )
}

export function BukyNew() {
  return (
    <Screen bg="#16291F" color="#F2E9D8" font={SERIF}>
      <svg viewBox="0 0 206 150" width="206" height="150" style={{ display: 'block' }}>
        <rect width="206" height="150" fill="#2C4A3A" />
        <circle cx="160" cy="34" r="14" fill="#E2B04A" />
        <path d="M-10 150 L60 50 L110 120 L150 70 L220 150Z" fill="#1E3A2D" />
        <path d="M60 50 L74 70 L66 66 L58 74 L50 64Z" fill="#F2E9D8" />
        <path d="M150 70 L162 86 L154 83 L146 90 L140 82Z" fill="#F2E9D8" />
        <path d="M-10 150 L30 112 L70 150Z" fill="#16291F" />
      </svg>
      <p style={{ margin: '-30px 12px 0', position: 'relative', fontSize: 25, fontWeight: 700, lineHeight: 1 }}>U Tří buků</p>
      <p style={{ margin: '4px 12px 0', fontFamily: SANS, fontSize: 9, color: '#C9D8C2' }}>Penzion v Krkonoších · snídaně v ceně</p>
      <div style={{ margin: '12px 12px 0', padding: 10, borderRadius: 12, background: '#F2E9D8', color: '#16291F', fontFamily: SANS }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#5B6B5F' }}>
          <span>Příjezd</span>
          <span>Odjezd</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
          <span>pá 14. 3.</span>
          <span>→</span>
          <span>ne 16. 3.</span>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 8, color: '#5B6B5F' }}>2 noci · 2 dospělí</p>
      </div>
      <div style={{ margin: '8px 12px 0', padding: '9px 10px', borderRadius: 12, border: '1px solid #3C5A49', fontFamily: SANS, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700 }}>Dvoulůžkový pokoj</p>
          <p style={{ margin: '2px 0 0', fontSize: 8, color: '#9FC29A' }}>● volno</p>
        </div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700 }}>3 800 Kč</p>
      </div>
      <div style={{ margin: '8px 12px 0', padding: '9px 10px', borderRadius: 12, border: '1px solid #3C5A49', fontFamily: SANS, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700 }}>Rodinný pokoj</p>
          <p style={{ margin: '2px 0 0', fontSize: 8, color: '#9FC29A' }}>● volno</p>
        </div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700 }}>5 200 Kč</p>
      </div>
      <div style={{ margin: '10px 12px 0', display: 'flex', flexWrap: 'wrap', gap: 4, fontFamily: SANS }}>
        {['Snídaně', 'Sauna', 'Parkování', 'Wi-Fi'].map((t) => (
          <span key={t} style={{ padding: '3px 7px', borderRadius: 999, background: '#24402F', fontSize: 7.5, color: '#C9D8C2' }}>
            ✓ {t}
          </span>
        ))}
      </div>
      <span style={{ position: 'absolute', left: 12, right: 12, bottom: 14, padding: '12px 0', borderRadius: 12, background: '#E2B04A', color: '#16291F', textAlign: 'center', fontFamily: SANS, fontSize: 11, fontWeight: 800 }}>
        Rezervovat pokoj
      </span>
    </Screen>
  )
}

/* ---------- Klíč, car service: "cena dohodou" → prices and a running total ---------- */

export function KlicOld() {
  const rows = ['Výměna oleje', 'Pneuservis', 'Příprava na STK', 'Geometrie', 'Klimatizace']
  return (
    <Screen bg="#2B2B2B" color="#DDD" font="Arial,Helvetica,sans-serif">
      <div style={{ padding: '14px 12px 10px', borderBottom: '3px solid #E8C200' }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 900, letterSpacing: '0.04em', color: '#E8C200' }}>AUTOSERVIS KLÍČ</p>
        <p style={{ margin: '2px 0 0', fontSize: 8, color: '#999' }}>Profesionální péče o váš vůz</p>
      </div>
      <p style={{ margin: '12px 12px 6px', fontSize: 10, fontWeight: 700 }}>Naše služby</p>
      {rows.map((r) => (
        <div key={r} style={{ margin: '0 12px', padding: '6px 0', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
          <span>{r}</span>
          <span style={{ color: '#888', fontStyle: 'italic' }}>cena dohodou</span>
        </div>
      ))}
      <p style={{ margin: '12px 12px 6px', fontSize: 8.5, color: '#AAA' }}>Pro cenovou nabídku vyplňte formulář:</p>
      {['Jméno', 'Telefon', 'SPZ', 'Popis závady'].map((f) => (
        <div key={f} style={{ margin: '0 12px 5px', height: 16, background: '#3A3A3A', border: '1px solid #555', fontSize: 7, color: '#777', padding: '3px 5px' }}>
          {f}
        </div>
      ))}
    </Screen>
  )
}

export function KlicNew() {
  const rows: [string, string, boolean][] = [
    ['Výměna oleje a filtru', '990', true],
    ['Přezutí pneumatik', '590', true],
    ['Příprava na STK', '790', false],
    ['Kontrola klimatizace', '450', false],
    ['Geometrie', '690', false],
  ]
  return (
    <Screen bg="#F2F2EF" color="#121212" font={MONO}>
      <div style={{ padding: '12px 12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 18, letterSpacing: '0.02em' }}>KLÍČ</span>
        <span style={{ fontSize: 7, padding: '3px 6px', background: '#121212', color: '#F2F2EF' }}>OSTRAVA</span>
      </div>
      <p style={{ margin: '12px 12px 0', fontFamily: ARCHIVO, fontWeight: 800, fontStretch: '75%', fontSize: 28, lineHeight: 0.9, textTransform: 'uppercase' }}>
        Kolik to
        <br />
        bude stát?
      </p>
      <div style={{ margin: '12px 12px 0', padding: '7px 8px', border: '1.5px solid #121212', fontSize: 8.5, display: 'flex', justifyContent: 'space-between' }}>
        <span>Škoda Octavia · 2016</span>
        <span>▾</span>
      </div>
      <div style={{ margin: '8px 12px 0' }}>
        {rows.map(([name, price, on]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 0', borderBottom: '1px dashed #BBB', fontSize: 8.5 }}>
            <span
              style={{
                width: 11,
                height: 11,
                border: '1.5px solid #121212',
                background: on ? '#FF5A1F' : 'transparent',
                display: 'grid',
                placeItems: 'center',
                color: '#121212',
                fontSize: 8,
                lineHeight: 1,
              }}
            >
              {on ? '✓' : ''}
            </span>
            <span style={{ flex: 1 }}>{name}</span>
            <b style={{ fontSize: 10 }}>{price} Kč</b>
          </div>
        ))}
      </div>
      <p style={{ margin: '10px 12px 0', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 7px', background: '#FFE3D6', fontSize: 7.5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2BB673' }} />
        Volno zítra od 7:00 · auto do 17:00
      </p>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 12px 12px', background: '#121212', color: '#F2F2EF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
          <span>Celkem</span>
          <b style={{ fontSize: 15, color: '#FF5A1F' }}>1 580 Kč</b>
        </div>
        <span style={{ display: 'block', marginTop: 8, padding: '9px 0', background: '#FF5A1F', color: '#121212', textAlign: 'center', fontSize: 10, fontWeight: 700 }}>
          Objednat na zítra 7:00
        </span>
      </div>
    </Screen>
  )
}

/* ---------- Kopretina, florist: pop-ups everywhere → calm, call and go ---------- */

function Daisy({ size = 22, centre = '#F2C14E' }: { size?: number; centre?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse key={a} cx="12" cy="5" rx="2.6" ry="5" fill="#FFFFFF" stroke="#E6DCCB" strokeWidth="0.6" transform={`rotate(${a} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="3.6" fill={centre} />
    </svg>
  )
}

export function KopretinaOld() {
  return (
    <Screen bg="#FFFFFF" color="#333" font="Verdana,Arial,sans-serif">
      <div style={{ background: '#5BA85B', padding: '10px', color: '#fff', fontSize: 13, fontWeight: 700 }}>Květinářství Kopretina</div>
      <div style={{ height: 120, background: '#E9A0B2', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>VÍTEJTE!</div>
      <p style={{ margin: '8px 10px', fontSize: 8 }}>Nabízíme řezané květiny, vazbu a svatební dekorace...</p>
      {/* Everything is covered: a dimmed overlay, a newsletter pop-up, a chat bubble and a cookie bar. */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
      <div style={{ position: 'absolute', left: 16, right: 16, top: 70, padding: 12, background: '#fff', borderRadius: 4, textAlign: 'center' }}>
        <span style={{ position: 'absolute', right: 5, top: 2, fontSize: 7, color: '#BBB' }}>✕</span>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#5BA85B' }}>Nezmeškejte novinky!</p>
        <p style={{ margin: '4px 0 8px', fontSize: 7.5 }}>Přihlaste se k odběru a získejte 5% slevu na první nákup.</p>
        <div style={{ height: 16, border: '1px solid #CCC', fontSize: 7, color: '#AAA', textAlign: 'left', padding: '3px 5px' }}>Váš e-mail</div>
        <div style={{ marginTop: 5, padding: '5px 0', background: '#5BA85B', color: '#fff', fontSize: 8, fontWeight: 700 }}>ODEBÍRAT</div>
      </div>
      <div style={{ position: 'absolute', right: 10, bottom: 92, width: 30, height: 30, borderRadius: '50%', background: '#2D7FF9', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13 }}>💬</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 10, background: '#222', color: '#EEE', fontSize: 7.5, lineHeight: '10px' }}>
        Tento web používá cookies ke zlepšení vašeho zážitku, analýze návštěvnosti a personalizaci reklam. Více informací naleznete v zásadách.
        <div style={{ marginTop: 6, display: 'flex', gap: 5 }}>
          <span style={{ flex: 1, padding: '5px 0', background: '#5BA85B', textAlign: 'center' }}>Přijmout vše</span>
          <span style={{ flex: 1, padding: '5px 0', border: '1px solid #666', textAlign: 'center' }}>Nastavení</span>
        </div>
      </div>
    </Screen>
  )
}

export function KopretinaNew() {
  const bouquets: [string, string, string][] = [
    ['#E58AA0', 'Růžová', '490 Kč'],
    ['#F2C14E', 'Slunce', '650 Kč'],
    ['#9CC59A', 'Louka', '890 Kč'],
  ]
  return (
    <Screen bg="#FBF6EE" color="#2E3A2A" font={SANS}>
      <div style={{ padding: '14px 12px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Daisy />
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Kopretina</span>
      </div>
      <p style={{ margin: '14px 12px 0', fontSize: 22, fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em' }}>
        Kytice ještě dnes,
        <br />
        <span style={{ color: '#D4486B' }}>až ke dveřím.</span>
      </p>
      <div style={{ margin: '10px 12px 0', padding: '8px 10px', borderRadius: 999, background: '#EAF3E6', fontSize: 8.5, display: 'flex', justifyContent: 'space-between' }}>
        <span>● Otevřeno do 18:00</span>
        <b>Husova 12, Plzeň</b>
      </div>
      <div style={{ margin: '12px 12px 0', display: 'flex', gap: 6 }}>
        {bouquets.map(([c, n, p]) => (
          <div key={n} style={{ flex: 1, padding: 6, borderRadius: 14, background: '#FFFFFF', border: '1px solid #EDE3D3', textAlign: 'center' }}>
            <div style={{ height: 58, borderRadius: 10, background: c, display: 'grid', placeItems: 'center' }}>
              <Daisy size={26} centre="#D4486B" />
            </div>
            <p style={{ margin: '5px 0 0', fontSize: 8, fontWeight: 700 }}>{n}</p>
            <p style={{ margin: 0, fontSize: 8, color: '#7A6B5A' }}>{p}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '12px 12px 0', fontSize: 8.5, color: '#7A6B5A' }}>Objednávky do 14:00 rozvážíme po Plzni týž den.</p>
      <div style={{ position: 'relative', margin: '10px 12px 0', height: 74, borderRadius: 14, overflow: 'hidden', background: '#E8EFE1' }}>
        <svg viewBox="0 0 182 74" width="182" height="74" style={{ display: 'block' }}>
          <path d="M-5 50 C 40 40, 80 62, 190 30" stroke="#FFFFFF" strokeWidth="8" fill="none" />
          <path d="M60 -5 L 78 80" stroke="#FFFFFF" strokeWidth="6" fill="none" />
          <path d="M120 -5 C 112 30, 130 50, 126 80" stroke="#FFFFFF" strokeWidth="5" fill="none" />
          <rect x="18" y="8" width="30" height="22" rx="4" fill="#D5E3C9" />
          <rect x="138" y="44" width="34" height="22" rx="4" fill="#D5E3C9" />
          <path d="M98 20 C 98 12, 110 12, 110 20 C 110 28, 104 34, 104 34 C 104 34, 98 28, 98 20Z" fill="#D4486B" />
          <circle cx="104" cy="20" r="2.6" fill="#FFFFFF" />
        </svg>
        <span style={{ position: 'absolute', left: 8, bottom: 6, fontSize: 7, fontWeight: 700, background: '#FFFFFF', padding: '2px 6px', borderRadius: 999 }}>4 min pěšky od náměstí</span>
      </div>
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 14, display: 'flex', gap: 6 }}>
        <span style={{ flex: 1, padding: '11px 0', borderRadius: 999, background: '#D4486B', color: '#fff', textAlign: 'center', fontSize: 10, fontWeight: 700 }}>Zavolat</span>
        <span style={{ flex: 1, padding: '11px 0', borderRadius: 999, border: '1.5px solid #2E3A2A', textAlign: 'center', fontSize: 10, fontWeight: 700 }}>Navigovat</span>
      </div>
    </Screen>
  )
}

/* ---------- Café AdAstra: the real proposal, from its screenshots ---------- */

export function AdAstraShot({ which }: { which: 'old' | 'new' }) {
  const img = which === 'old' ? { src: 'images/adastra-old-mobile.jpg', w: 750, h: 1564 } : { src: 'images/adastra-new-mobile.jpg', w: 375, h: 782 }
  return (
    <div aria-hidden="true" style={{ width: SCREEN.w, height: SCREEN.h, overflow: 'hidden', background: which === 'old' ? '#2A2220' : '#F2F1EE' }}>
      <img
        src={import.meta.env.BASE_URL + img.src}
        alt=""
        width={img.w}
        height={img.h}
        loading="lazy"
        decoding="async"
        style={{ display: 'block', width: '100%', height: 'auto', filter: which === 'old' ? 'saturate(0.7)' : undefined }}
      />
    </div>
  )
}

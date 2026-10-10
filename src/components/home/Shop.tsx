import type { CSSProperties, ReactNode } from 'react'

/*
 * Šlapadlo, the invented bike shop: its old site (ShopBefore) and the new one
 * (ShopAfter), as 340 × 709 phone screens. Ported one to one from
 * docs/design/source/ShopBefore.dc.html and ShopAfter.dc.html: same sizes,
 * colours and copy. Smaller copies are scaled with CSS transform (ShopScreen).
 *
 * They are pictures of a website, not a website: the links are spans that
 * look like links, and the whole screen is hidden from screen readers. The
 * phone frame around it carries the description (role="img" + aria-label).
 * The `.shop` class (index.css) restores the browser defaults the source
 * relies on (content-box sizing, normal text wrapping).
 */

const SHOP = { width: 340, height: 709 }

/** A shop screen at `scale`, shifted up by `offsetY` (in unscaled px) like the source does. */
export function ShopScreen({ scale = 1, offsetY = 0, children }: { scale?: number; offsetY?: number; children: ReactNode }) {
  if (scale === 1 && offsetY === 0) return children
  return (
    <div
      style={{
        width: SHOP.width,
        height: SHOP.height,
        transform: `scale(${scale})${offsetY ? ` translateY(${-offsetY}px)` : ''}`,
        transformOrigin: '0 0',
      }}
    >
      {children}
    </div>
  )
}

const link = (color: string): CSSProperties => ({ color, textDecoration: 'underline' })
const BLUE = link('#0000EE')
const VISITED = link('#551A8B')
const cell: CSSProperties = { border: '1px solid #999999', padding: '2px 6px' }

export function ShopBefore() {
  return (
    <div
      aria-hidden="true"
      className="shop"
      style={{
        width: 340,
        height: 709,
        background: '#EFEFEF',
        fontFamily: "'Times New Roman',Times,serif",
        color: '#222222',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <div style={{ background: 'linear-gradient(180deg,#2A4D9B 0%,#6FA0E0 100%)', padding: '14px 8px 12px' }}>
        <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#FFE600', textShadow: '2px 2px 0 #000000', letterSpacing: 1 }}>
          ŠLAPADLO s.r.o.
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#FFFFFF', fontStyle: 'italic' }}>Opravy a prodej jízdních kol od roku 1998</p>
      </div>
      <p style={{ margin: 0, background: '#CCCCCC', padding: '6px 4px', fontSize: 12, lineHeight: '18px', borderBottom: '1px solid #999999' }}>
        <span style={BLUE}>Úvod</span> | <span style={BLUE}>O nás</span> | <span style={VISITED}>Služby</span> |{' '}
        <span style={BLUE}>Ceník (PDF)</span> | <span style={BLUE}>Fotogalerie</span> | <span style={BLUE}>Kontakt</span>
      </p>
      <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 700, color: '#FF0000' }}>!!! NOVĚ OTEVŘENO I V SOBOTU !!!</p>
      <p style={{ margin: '10px 14px 0', fontSize: 13, lineHeight: '17px' }}>
        Vítejte na našich webových stránkách. Jsme firma s dlouholetou tradicí v oboru opravy jízdních kol všech značek. Naším cílem je
        spokojený zákazník. Neváhejte nás kontaktovat.
      </p>
      <div
        style={{
          margin: '12px auto 0',
          width: 200,
          height: 120,
          border: '1px solid #999999',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontSize: 11,
          color: '#777777',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            border: '1px solid #CC0000',
            color: '#CC0000',
            fontSize: 11,
            lineHeight: '13px',
            fontFamily: 'Arial,sans-serif',
          }}
        >
          x
        </span>
        foto_dilna_2.jpg
      </div>
      <table style={{ margin: '12px auto 0', fontSize: 11, borderCollapse: 'collapse', border: '1px solid #999999' }}>
        <tbody>
          <tr>
            <td style={cell}>Po-Pá</td>
            <td style={cell}>9:00-12:00, 13:00-17:30</td>
          </tr>
          <tr>
            <td style={cell}>So</td>
            <td style={cell}>dle dohody</td>
          </tr>
        </tbody>
      </table>
      <p style={{ margin: '12px 14px 0', fontSize: 13 }}>
        <span style={BLUE}>Ceník služeb ke stažení (PDF, 4,2 MB)</span>
      </p>
      <p style={{ margin: '12px 14px 0', fontSize: 12, lineHeight: '16px' }}>
        Pro objednání servisu vyplňte formulář v sekci Kontakt, nebo nás navštivte osobně na provozovně.
      </p>
      <p style={{ margin: '12px 14px 0', fontSize: 12 }}>
        <span style={BLUE}>Kniha návštěv</span> | <span style={BLUE}>Odkazy na přátele</span> | <span style={BLUE}>Mapa stránek</span>
      </p>
      <p style={{ margin: '12px 14px 0', fontSize: 11, lineHeight: '15px', color: '#555555', fontStyle: 'italic' }}>
        Stránky jsou optimalizovány pro Internet Explorer 8 a rozlišení 1024 × 768.
      </p>
      <div
        style={{
          margin: '12px auto 0',
          width: 150,
          padding: 6,
          border: '2px outset #DDDDDD',
          background: '#FFFFCC',
          fontSize: 11,
          lineHeight: '14px',
        }}
      >
        Přidejte si nás
        <br />
        do oblíbených! ★
      </div>
      <p style={{ margin: '16px 0 0', fontSize: 11, color: '#555555' }}>
        Počet návštěv:{' '}
        <span style={{ fontFamily: "'Courier New',monospace", background: '#000000', color: '#00FF00', padding: '0 4px' }}>004817</span>
      </p>
      <p style={{ margin: '6px 0 0', fontSize: 10, color: '#777777' }}>Naposledy aktualizováno: 12. 3. 2014</p>
      <p style={{ margin: '6px 0 0', fontSize: 10, color: '#777777' }}>© Šlapadlo s.r.o. Všechna práva vyhrazena.</p>
    </div>
  )
}

const priceRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '9px 0',
  borderTop: '1px solid #E6E6E6',
  fontSize: 16,
  fontWeight: 700,
}
const button: CSSProperties = {
  textAlign: 'center',
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 800,
  borderRadius: 10,
}

export function ShopAfter() {
  return (
    <div
      aria-hidden="true"
      className="shop"
      style={{
        width: 340,
        height: 709,
        background: '#FFD23F',
        color: '#121212',
        fontFamily: "'Archivo Variable','Archivo','Arial Narrow',Arial,sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: 52,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#121212',
          color: '#FFD23F',
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 900, fontStretch: '125%', letterSpacing: '-0.02em' }}>šlapadlo</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FFFFFF' }}>
          Servis kol · Praha 7
        </span>
      </div>
      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#121212',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 700,
            padding: '6px 10px',
            borderRadius: 999,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3DDC84' }} />
          Otevřeno · do 18:00
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 58,
            lineHeight: 0.86,
            fontWeight: 900,
            fontStretch: '72%',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          Kolo zpátky na silnici do 48 hodin.
        </p>
        <p style={{ margin: 0, fontSize: 15, lineHeight: '21px', fontWeight: 500 }}>
          Přivezte kolo ráno, vyzvedněte si ho pozítří. Cenu víte předem.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ ...button, flex: 1, background: '#121212', color: '#FFD23F', padding: '14px 8px' }}>Objednat servis</span>
          <span style={{ ...button, background: '#FFFFFF', color: '#121212', padding: '14px 14px' }}>Zavolat</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: '#FFFFFF',
          borderRadius: '20px 20px 0 0',
          padding: '16px 16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#6B6B6B',
          }}
        >
          Ceník
        </p>
        <div style={priceRow}>
          <span>Seřízení brzd</span>
          <span>290 Kč</span>
        </div>
        <div style={priceRow}>
          <span>Výměna duše</span>
          <span>190 Kč</span>
        </div>
        <div style={priceRow}>
          <span>Velký servis</span>
          <span>1 490 Kč</span>
        </div>
        <span style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: '#121212', textDecoration: 'underline' }}>
          Dělnická 12, Praha 7 · mapa ↗
        </span>
      </div>
    </div>
  )
}

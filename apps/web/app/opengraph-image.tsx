import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'IAI V3.0'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #09090b 0%, #111827 55%, #1f2937 100%)',
          color: '#f8fafc',
          padding: '56px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5c451',
                color: '#09090b',
                fontSize: '34px',
                fontWeight: 800,
              }}
            >
              I
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: '22px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#f5c451' }}>
                IAI V3.0
              </div>
              <div style={{ fontSize: '28px', color: '#cbd5e1' }}>
                Intelligence · Artistry · International
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '20px',
              color: '#e2e8f0',
            }}
          >
            <span>app.iai.one</span>
            <span style={{ color: '#64748b' }}>·</span>
            <span>nft.iai.one</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '960px',
          }}
        >
          <div
            style={{
              fontSize: '68px',
              lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            Social, collaboration, marketplace and verified knowledge in one education stack.
          </div>
          <div
            style={{
              display: 'flex',
              gap: '18px',
              flexWrap: 'wrap',
              fontSize: '26px',
              color: '#cbd5e1',
            }}
          >
            <span>Phase 2 · Social+</span>
            <span>Collaboration</span>
            <span>Marketplace</span>
            <span>n8n Flow</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '22px',
            color: '#94a3b8',
          }}
        >
          <span>Proof layer via IPFS · Polygon · Knowledge NFT · DAO</span>
          <span>SEO-ready V3.0</span>
        </div>
      </div>
    ),
    size,
  )
}

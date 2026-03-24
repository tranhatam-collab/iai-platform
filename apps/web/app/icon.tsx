import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 64,
  height: 64,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5c451 0%, #f59e0b 100%)',
          borderRadius: '18%',
          color: '#09090b',
          fontSize: '34px',
          fontWeight: 900,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        I
      </div>
    ),
    size,
  )
}

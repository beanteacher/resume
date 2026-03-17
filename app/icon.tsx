import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#1a0533',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Bean body */}
        <div style={{ position: 'relative', width: 20, height: 18, display: 'flex' }}>
          {/* Main oval */}
          <div
            style={{
              position: 'absolute',
              width: 20,
              height: 18,
              background: '#7C3AED',
              borderRadius: '50%',
            }}
          />
          {/* Kidney indent (right side) */}
          <div
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              background: '#1a0533',
              borderRadius: '50%',
              top: 4,
              right: -3,
            }}
          />
          {/* Shine highlight */}
          <div
            style={{
              position: 'absolute',
              width: 5,
              height: 4,
              background: 'rgba(255,255,255,0.35)',
              borderRadius: '50%',
              top: 3,
              left: 4,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}

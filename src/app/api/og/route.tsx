import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title') || 'Folio'
    const subtitle = searchParams.get('subtitle') || 'The Daily Skill Tracker'

    // Load fonts
    const playfairDisplay = await fetch(
      new URL('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap')
    ).then((res) => res.text())

    const ibmPlexMono = await fetch(
      new URL('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap')
    ).then((res) => res.text())

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F0E8',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Paper texture overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 31px,
                #D6D0C7 31px,
                #D6D0C7 32px
              )`,
              opacity: 0.15,
            }}
          />

          {/* Top double rule */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 60,
              right: 60,
              height: 3,
              backgroundColor: '#1A1A1A',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 47,
              left: 60,
              right: 60,
              height: 1,
              backgroundColor: '#1A1A1A',
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            {/* Masthead */}
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 120,
                fontWeight: 700,
                color: '#1A1A1A',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1,
              }}
            >
              FOLIO
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: 'Courier New, monospace',
                fontSize: 24,
                color: '#7A7A7A',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: 16,
              }}
            >
              THE DAILY SKILL TRACKER
            </p>

            {/* Decorative rule */}
            <div
              style={{
                width: 200,
                height: 3,
                backgroundColor: '#1A1A1A',
                marginTop: 32,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                width: 200,
                height: 1,
                backgroundColor: '#1A1A1A',
              }}
            />

            {/* Tagline */}
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 36,
                color: '#3D3D3D',
                textAlign: 'center',
                maxWidth: 700,
                marginTop: 48,
                lineHeight: 1.4,
              }}
            >
              Turn your goals into structured stories
            </p>

            {/* Feature bullets */}
            <div
              style={{
                display: 'flex',
                gap: 32,
                marginTop: 40,
              }}
            >
              {['Milestones', 'Sessions', 'Progress'].map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#2A5C3F',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: 18,
                      color: '#3D3D3D',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom double rule */}
          <div
            style={{
              position: 'absolute',
              bottom: 47,
              left: 60,
              right: 60,
              height: 3,
              backgroundColor: '#1A1A1A',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 60,
              right: 60,
              height: 1,
              backgroundColor: '#1A1A1A',
            }}
          />

          {/* Footer text */}
          <p
            style={{
              position: 'absolute',
              bottom: 60,
              fontFamily: 'Courier New, monospace',
              fontSize: 14,
              color: '#7A7A7A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            EST. 2026 · PRINTED ON THE WEB
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}

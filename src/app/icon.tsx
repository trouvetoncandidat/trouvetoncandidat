import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '20%',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Tricolore Background */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '33.33%', height: '100%', background: '#000091' }} />
                <div style={{ position: 'absolute', top: 0, left: '33.33%', width: '33.33%', height: '100%', background: 'white' }} />
                <div style={{ position: 'absolute', top: 0, left: '66.66%', width: '33.33%', height: '100%', background: '#E1000F' }} />

                {/* Ballot Box Icon - Simplified for pixel clarity */}
                <div
                    style={{
                        position: 'absolute',
                        width: '60%',
                        height: '40%',
                        background: 'white',
                        borderRadius: '2px',
                        border: '2px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                >
                    <div style={{ width: '40%', height: '2px', background: '#000091', borderRadius: '1px' }} />
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}

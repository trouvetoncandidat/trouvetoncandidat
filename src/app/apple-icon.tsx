import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
    width: 180,
    height: 180,
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
                    position: 'relative',
                }}
            >
                {/* Tricolore Background */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '33.33%', height: '100%', background: '#000091' }} />
                <div style={{ position: 'absolute', top: 0, left: '33.33%', width: '33.33%', height: '100%', background: 'white' }} />
                <div style={{ position: 'absolute', top: 0, left: '66.66%', width: '33.33%', height: '100%', background: '#E1000F' }} />

                {/* Ballot Box Icon */}
                <div
                    style={{
                        position: 'absolute',
                        width: '100px',
                        height: '70px',
                        background: 'white',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    }}
                >
                    {/* Slot */}
                    <div style={{ width: '40px', height: '6px', background: '#000091', borderRadius: '3px', marginBottom: '8px' }} />
                    {/* Tick shape simplified */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }} />
                        <div style={{ width: '8px', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }} />
                        <div style={{ width: '8px', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }} />
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}

'use client'
import { useState, useEffect } from 'react'

const FRASES = [
  'Analizando tus respuestas...',
  'Preparando tu diagnóstico personalizado...',
  'Un consultor está revisando tu negocio...',
  'Casi listo. Esto vale la pena.',
]

export function InformeButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [fraseIdx, setFraseIdx] = useState(0)

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setFraseIdx(i => (i + 1) % FRASES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [loading])

  const handleClick = async () => {
    setLoading(true)
    setFraseIdx(0)
    try {
      const url = `/api/informe/diagnostico/${userId}`
      const res = await fetch(url)
      const html = await res.text()
      document.open()
      document.write(html)
      document.close()
    } catch {
      setLoading(false)
      window.location.href = `/api/informe/diagnostico/${userId}`
    }
  }

  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '4px solid rgba(255,77,106,0.2)',
              borderTopColor: '#FF4D6A',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p
            style={{
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 600,
              textAlign: 'center',
              maxWidth: 340,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {FRASES[fraseIdx]}
          </p>
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-14 px-8 text-base font-semibold hover:bg-primary/80 transition-colors w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Ver mi Informe de Diagnóstico →
      </button>
    </>
  )
}

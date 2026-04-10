import Link from 'next/link'

export const metadata = {
  title: 'Cómo funciona — Rentabilismo Academy',
}

const ETIQUETA = 'CÓMO FUNCIONA'
const TITULO = 'Aquí no vienes a ver vídeos y ya está.'
const SUBTITULO =
  'Vienes a sentarte una vez a la semana, mirar tu negocio con calma y tomar decisiones que se noten en la cuenta corriente.'

const PASOS_QUE_ES = [
  {
    n: '01',
    texto:
      'Rentabilismo está pensado para que trabajes sobre tu empresa, no sobre ejemplos inventados.',
  },
  {
    n: '02',
    texto: 'Yo marco el camino con 10 módulos y preguntas concretas.',
  },
  {
    n: '03',
    texto:
      'Tú traes tus números, tus dudas y tus decisiones. Nadie lo hace por ti, pero no estás solo.',
  },
]

const CAPAS = [
  {
    n: '01',
    titulo: 'Entender',
    texto: 'Vídeo de 10-12 minutos. El problema, el enfoque, qué vas a trabajar.',
  },
  {
    n: '02',
    titulo: 'Procesar',
    texto: 'Lecciones para que te veas reflejado: preguntas, casos reales y errores típicos.',
  },
  {
    n: '03',
    titulo: 'Actuar',
    texto: 'Ejercicios con tus datos reales: precios, gastos, equipo, procesos, márgenes.',
  },
  {
    n: '04',
    titulo: 'Revisar y ajustar',
    texto:
      'Vuelves al módulo cuando tu empresa cambia y actualizas tus respuestas. El ciclo no termina.',
  },
]

const BULLETS_DATOS = [
  'Cada respuesta que das se guarda en tu espacio privado.',
  'El sistema te enseña tu progreso por módulos y lecciones.',
  'Puedes volver dentro de un mes, revisar lo que escribiste y añadir mejoras.',
]

const PASOS_RITMO = [
  {
    n: '01',
    texto: 'Vídeo de arranque de 10-12 min: el problema, el enfoque y qué vas a cambiar.',
  },
  {
    n: '02',
    texto: '4-5 lecciones con teoría, casos reales y ejercicios con tus propios números.',
  },
  {
    n: '03',
    texto: '3 horas a la semana: primeras mejoras concretas en el primer mes.',
  },
  {
    n: '04',
    texto: 'En 2 meses: decisiones tomadas, números revisados y procesos cambiados.',
  },
]

const CHECKS_CTA = [
  'Al crear tu cuenta, tienes acceso completo al Módulo 1: Mentalidad.',
  'Ahí no hablamos de "pensar en positivo"; hablamos de dejar de engañarte con tu empresa y asumir el papel de director, no de bombero.',
  'Si lo que ves ahí te remueve y te encaja la forma de trabajar, el resto del programa tiene sentido. Si no, mejor no sigas.',
]

export default function ComoFuncionaPage() {
  return (
    <div className="px-8 py-10">
      <div className="space-y-16">

        {/* ── BLOQUE 1: HEADER ── */}
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
            {ETIQUETA}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {TITULO}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            {SUBTITULO}
          </p>
        </section>

        {/* ── BLOQUE 2: QUÉ ES ESTO ── */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">No es un curso. Es un proceso.</h2>
          <ol className="space-y-4">
            {PASOS_QUE_ES.map(({ n, texto }) => (
              <li key={n} className="flex items-start gap-4">
                <span className="text-sm font-bold text-[#1D9E75] shrink-0 w-6">{n}</span>
                <span className="text-sm md:text-base">{texto}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── BLOQUE 3: LAS 4 CAPAS ── */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Cada módulo tiene cuatro capas.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CAPAS.map(({ n, titulo, texto }) => (
              <div
                key={n}
                className="rounded-sm border border-border bg-card p-5 space-y-2"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#1D9E75]">{n}</span>
                  <span className="font-semibold text-sm">{titulo}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
          <p className="text-sm md:text-base text-muted-foreground border-l-2 border-[#1D9E75] pl-4">
            Si solo ves el vídeo, te inspiras un rato. Si haces los ejercicios, cierras el portátil
            con decisiones tomadas.
          </p>
        </section>

        {/* ── BLOQUE 4: TUS DATOS ── */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold">
            Todo lo que escribes se queda en tu diagnóstico vivo.
          </h2>
          <ul className="space-y-3">
            {BULLETS_DATOS.map((texto) => (
              <li key={texto} className="flex items-start gap-3 text-sm md:text-base">
                <span className="mt-0.5 text-[#1D9E75] font-bold shrink-0">—</span>
                <span>{texto}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm md:text-base text-muted-foreground">
            No son tareas para entregarle a nadie. Es un cuaderno de trabajo vivo sobre tu empresa,
            que solo tú ves y que más adelante podrás descargar como informe con todo tu trabajo y
            tus decisiones clave.
          </p>
        </section>

        {/* ── BLOQUE 5: EL RITMO ── */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">
            3 horas a la semana.{' '}
            <span className="text-muted-foreground font-normal">En 2 meses, mejoras notables.</span>
          </h2>
          <ol className="space-y-4">
            {PASOS_RITMO.map(({ n, texto }) => (
              <li key={n} className="flex items-start gap-4">
                <span className="text-sm font-bold text-[#1D9E75] shrink-0 w-6">{n}</span>
                <span className="text-sm md:text-base">{texto}</span>
              </li>
            ))}
          </ol>
          <p className="text-sm md:text-base text-muted-foreground">
            No se trata de encontrar tiempo, se trata de reservarlo. Tres horas a la semana para
            pensar, decidir y arreglar cosas que llevas meses posponiendo.
          </p>
        </section>

        {/* ── BLOQUE 6: CTA ── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
              Módulo 1 — Gratis
            </p>
            <h2 className="text-xl font-semibold">
              El cambio empieza por ti y por eso es el más importante.
            </h2>
          </div>

          <ul className="space-y-3">
            {CHECKS_CTA.map((texto) => (
              <li key={texto} className="flex items-start gap-3 text-sm md:text-base">
                <span className="mt-0.5 text-[#1D9E75] font-bold shrink-0">✓</span>
                <span>{texto}</span>
              </li>
            ))}
          </ul>

          <p className="text-sm md:text-base text-muted-foreground">
            El Módulo 1 es para que decidas si estás preparado. Yo no voy a perseguirte. Si quieres
            cambiar, das el siguiente paso y desbloqueas el programa entero.
          </p>

          <div className="space-y-3 pt-2">
            <Link
              href="/mentalidad"
              className="inline-block w-full md:w-auto px-8 py-3 bg-[#1D9E75] text-white text-sm font-semibold rounded-sm hover:opacity-90 transition-opacity text-center"
            >
              Empezar el Módulo 1 gratis →
            </Link>
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Entra aquí
              </Link>
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}

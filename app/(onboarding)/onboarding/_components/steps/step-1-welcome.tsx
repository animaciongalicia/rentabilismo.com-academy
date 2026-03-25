import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface StepWelcomeProps {
  fullName: string
  onNext: () => void
}

export default function StepWelcome({ fullName, onNext }: StepWelcomeProps) {
  const firstName = fullName.split(' ')[0]

  return (
    <Card className="w-full max-w-lg text-center">
      <CardHeader className="space-y-4 pb-4">
        <div className="text-5xl">👋</div>
        <CardTitle className="text-3xl leading-tight">
          Bienvenido, {firstName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-muted-foreground">
        <p className="text-lg leading-relaxed">
          Estás a punto de hacer algo que la{' '}
          <strong className="text-foreground">mayoría de empresarios nunca hace</strong>:
          parar, pensar con claridad y trazar un camino real hacia donde quieres llegar.
        </p>
        <p className="leading-relaxed">
          Este proceso dura menos de 5 minutos. Sé honesto contigo mismo —
          nadie más va a leer esto. Lo que escribas aquí es el punto de partida
          de tu transformación.
        </p>
      </CardContent>

      <CardFooter className="justify-center pt-4">
        <Button size="lg" onClick={onNext} className="min-w-40">
          Empezar
        </Button>
      </CardFooter>
    </Card>
  )
}

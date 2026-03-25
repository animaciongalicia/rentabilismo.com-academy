'use client'

import { useState, useTransition } from 'react'
import { Progress } from '@/components/ui/progress'
import { saveOnboarding, type OnboardingInput } from '../actions'
import StepWelcome from './steps/step-1-welcome'
import StepVision from './steps/step-2-vision'
import StepObstacle from './steps/step-3-obstacle'
import StepCommitment from './steps/step-4-commitment'
import StepPact from './steps/step-5-pact'

const TOTAL_STEPS = 5

interface OnboardingWizardProps {
  fullName: string
}

type FormData = Omit<OnboardingInput, never>

export default function OnboardingWizard({ fullName }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
  })
  const [signError, setSignError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  function goNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1))
  }

  function handleVision(q1: string) {
    setFormData((d) => ({ ...d, q1 }))
    goNext()
  }

  function handleObstacle(q2: string) {
    setFormData((d) => ({ ...d, q2 }))
    goNext()
  }

  function handleCommitment(q3: string, q4: string) {
    setFormData((d) => ({ ...d, q3, q4 }))
    goNext()
  }

  async function handleSign() {
    setSignError(null)
    startTransition(async () => {
      const result = await saveOnboarding(formData)
      if (result?.error) {
        setSignError(result.error)
      }
    })
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Barra de progreso */}
      <div className="space-y-2">
        <p className="text-center text-sm text-muted-foreground">
          Paso {step} de {TOTAL_STEPS}
        </p>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Paso actual */}
      {step === 1 && (
        <StepWelcome fullName={fullName} onNext={goNext} />
      )}
      {step === 2 && (
        <StepVision
          initial={formData.q1}
          onNext={handleVision}
          onBack={goBack}
        />
      )}
      {step === 3 && (
        <StepObstacle
          initial={formData.q2}
          onNext={handleObstacle}
          onBack={goBack}
        />
      )}
      {step === 4 && (
        <StepCommitment
          initialQ3={formData.q3}
          initialQ4={formData.q4}
          onNext={handleCommitment}
          onBack={goBack}
        />
      )}
      {step === 5 && (
        <StepPact
          fullName={fullName}
          onSign={handleSign}
          onBack={goBack}
          isPending={isPending}
          error={signError}
        />
      )}
    </div>
  )
}

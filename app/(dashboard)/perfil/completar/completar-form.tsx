'use client'

import { useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { completarPerfilAction, type CompletarPerfilState } from './actions'

const SECTORES = [
  'Restauración',
  'Clínica / Salud',
  'Gimnasio / Deporte',
  'Comercio local',
  'Servicios profesionales',
  'Construcción',
  'Educación',
  'Tecnología',
  'Otros',
]

const TAMANIOS = [
  { value: 'solo-yo', label: 'Solo yo' },
  { value: '2-5', label: '2–5 personas' },
  { value: '6-15', label: '6–15 personas' },
]

interface CompletarFormProps {
  fullName: string
  initials: string
  avatarColor: string
}

const initialState: CompletarPerfilState = { error: null }

export default function CompletarForm({ fullName, initials, avatarColor }: CompletarFormProps) {
  const [state, formAction] = useFormState(completarPerfilAction, initialState)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Avatar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 w-20 h-20 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Cambiar foto de perfil"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`${avatarColor} w-full h-full flex items-center justify-center`}
                >
                  <span className="text-white text-2xl font-bold leading-none">
                    {initials}
                  </span>
                </div>
              )}
            </button>
            <div className="space-y-1">
              <p className="text-sm font-medium">{fullName}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                {previewUrl ? 'Cambiar foto' : 'Subir foto (opcional)'}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sector */}
      <div className="space-y-2">
        <Label htmlFor="business_type">¿A qué sector pertenece tu negocio?</Label>
        <select
          id="business_type"
          name="business_type"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Selecciona tu sector</option>
          {SECTORES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Ubicación */}
      <div className="space-y-2">
        <Label htmlFor="business_location">¿En qué ciudad o zona operas?</Label>
        <Input
          id="business_location"
          name="business_location"
          type="text"
          placeholder="Ej: Madrid, Barcelona, Valencia..."
        />
      </div>

      {/* Tamaño empresa */}
      <div className="space-y-3">
        <Label>¿Cuántas personas trabajan en tu negocio?</Label>
        <div className="grid grid-cols-3 gap-3">
          {TAMANIOS.map(({ value, label }) => (
            <label
              key={value}
              className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-input bg-background p-4 text-center text-sm font-medium transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary"
            >
              <input
                type="radio"
                name="business_size"
                value={value}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Guardar y empezar el Diagnóstico
      </Button>
    </form>
  )
}

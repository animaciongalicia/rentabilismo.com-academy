import RegisterForm from './_components/register-form'

export const metadata = {
  title: 'Registro - Rentabilismo Academy',
  description: 'Crea tu cuenta y empieza tu camino hacia la rentabilidad',
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const { redirectTo = '/mentalidad' } = await searchParams
  return <RegisterForm redirectTo={redirectTo} />
}

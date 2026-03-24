export function translateLoginError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Email o contraseña incorrectos.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Confirma tu email antes de acceder. Revisa tu bandeja de entrada.'
  }
  if (message.includes('Too many requests')) {
    return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
  }
  return 'Error al iniciar sesión. Inténtalo de nuevo.'
}

export function translateRegisterError(message: string): string {
  if (message.includes('User already registered')) {
    return 'Este email ya está registrado. Prueba a acceder.'
  }
  if (message.includes('Password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (message.includes('Unable to validate email')) {
    return 'El formato del email no es válido.'
  }
  if (message.includes('Too many requests')) {
    return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
  }
  return 'Error al crear la cuenta. Inténtalo de nuevo.'
}

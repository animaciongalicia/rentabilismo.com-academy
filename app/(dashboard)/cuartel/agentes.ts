export type Agente = {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
  href?: string
}

export const AGENTES: Agente[] = [
  {
    id: 0,
    nombre: 'El Espejo',
    descripcion: 'Tu consultor de mentalidad empresarial',
    activo: true,
    href: '/cuartel/el-espejo',
  },
  {
    id: 1,
    nombre: 'El Forense',
    descripcion: 'Diagnóstico de rentabilidad',
    activo: false,
  },
  {
    id: 2,
    nombre: 'El Contable que No Te Miente',
    descripcion: 'Finanzas',
    activo: false,
  },
  {
    id: 3,
    nombre: 'El que Te Hace Diferente',
    descripcion: 'Producto y servicio',
    activo: false,
  },
  {
    id: 4,
    nombre: 'El Auditor de Precios',
    descripcion: 'Estrategia de precios',
    activo: false,
  },
  {
    id: 5,
    nombre: 'El Ladrón de Tiempo',
    descripcion: 'Operaciones y procesos',
    activo: false,
  },
  {
    id: 6,
    nombre: 'El Líder que Necesitas',
    descripcion: 'Equipo y liderazgo',
    activo: false,
  },
  {
    id: 7,
    nombre: 'El Cazador',
    descripcion: 'Ventas y captación',
    activo: false,
  },
  {
    id: 8,
    nombre: 'El Altavoz',
    descripcion: 'Marketing y posicionamiento',
    activo: false,
  },
  {
    id: 9,
    nombre: 'El Estratega',
    descripcion: 'Estrategia y crecimiento',
    activo: false,
  },
  {
    id: 10,
    nombre: 'El Planificador',
    descripcion: 'Tu plan de acción',
    activo: false,
  },
]

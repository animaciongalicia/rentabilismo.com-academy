-- Tabla de módulos del programa
CREATE TABLE IF NOT EXISTS public.modules (
  id           INTEGER PRIMARY KEY,
  order_number INTEGER UNIQUE NOT NULL,
  title        TEXT           NOT NULL,
  description  TEXT           NOT NULL,
  is_free      BOOLEAN        NOT NULL DEFAULT false,
  is_active    BOOLEAN        NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- RLS: catálogo público de solo lectura para usuarios autenticados
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "modules_select_authenticated"
  ON public.modules
  FOR SELECT
  TO authenticated
  USING (true);

-- Seed: 11 módulos en orden
INSERT INTO public.modules (id, order_number, title, description, is_free) VALUES
  (0,  0,  'El Punto de Partida',          'Mentalidad empresarial. Sin esto, lo demás no sirve.',                                                                    true),
  (1,  1,  'Diagnóstico de Rentabilidad',  'Qué está funcionando, qué no y por qué. La radiografía honesta de tu negocio.',                                           false),
  (2,  2,  'Los Números que Mandan',       'Márgenes, costes, flujo de caja y dónde va el dinero realmente.',                                                          false),
  (3,  3,  'Producto y Servicio',          'Qué vendes exactamente, a quién y si lo estás posicionando bien.',                                                          false),
  (4,  4,  'Propuesta de Valor',           'Por qué te eligen a ti y no a otro. Y cómo cobrarlo sin perder clientes.',                                                 false),
  (5,  5,  'Procesos y Operaciones',       'Cómo dejar de ser imprescindible para todo y construir una empresa que funcione sin ti.',                                   false),
  (6,  6,  'Personas, Equipo y Liderazgo', 'Las personas correctas en los puestos correctos y cómo gestionarlos bien.',                                                false),
  (7,  7,  'Vender sin Vender',            'Cómo convertir interés en clientes que pagan, con un proceso claro y sin presión.',                                        false),
  (8,  8,  'Publicidad y Marketing',       'Cómo te percibe el mercado, qué mensaje transmites y por qué te eligen.',                                                  false),
  (9,  9,  'Estrategia y Crecimiento',     'Hacia dónde vas, si el camino tiene sentido y cómo priorizar lo que de verdad importa.',                                   false),
  (10, 10, 'Plan de Acción',               'Qué vas a cambiar, en qué orden, con qué recursos y con qué métricas lo medirás.',                                         false)
ON CONFLICT (id) DO NOTHING;

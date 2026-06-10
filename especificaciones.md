📚 PRD: Wallapop Escolar (Modelo de Referencia)
1. PROPÓSITO Y NORTH STAR
Propósito: Mercadillo escolar privado para reutilización de material (libros, uniformes).
North Star: Clon funcional de la experiencia Wallapop. Toda decisión de diseño o lógica debe responder a: ¿Cómo lo haría Wallapop?
Mobile-First: Interfaz móvil nativa (max-w-md, diseño fluido).
Transaccionalidad: Nada de chats genéricos. El chat es un medio para un fin (el producto).
2. REGLAS DE DESARROLLO (STACK)
Frontend: Next.js (Turbopack), Tailwind CSS, Lucide Icons.
Backend/DB: Supabase (PostgreSQL + Auth + Storage).
Arquitectura: Thin Client. Consultas directas desde el frontend al cliente de Supabase.
Seguridad: RLS (Row Level Security) activo en todas las tablas.
Nomenclatura: snake_case estricto en DB (seller_id, image_url, created_at).
3. MODELOS DE DATOS (CONTRATO)
No usar select('*'). Seleccionar campos explícitos.
profiles: id (FK auth.users), name, bio, avatar_url, rating, reviews_count.
products: id, seller_id (FK profiles), name, description, price, category, state ('en_venta'|'reservado'|'vendido'), image_url, created_at.
messages: id, product_id (FK products), buyer_id (FK profiles), seller_id (FK profiles), content, created_at.
4. MECÁNICAS WALLAPOP (INNEGOCIABLES)
La Pestaña "Vender" es un formulario: No muestra listados. Al terminar, redirige al Perfil.
Chat por producto: Un chat = un producto. Si un comprador quiere dos libros, abre dos chats.
Control de Estados: El vendedor marca el estado (reservado/vendido) desde el chat. Esto actualiza el estado del producto en el Mercado al instante.
Soft Auth: Mercado público (lectura). Acciones (Vender/Contactar) requieren Auth.
5. ROADMAP DE EJECUCIÓN (TAREAS)
TAREA 1: Limpieza de UI (Desacoplar Vender)
Acción: SellView.tsx debe ser exclusivamente el formulario de subida.
Flujo: Tras handleSubmit exitoso, router.push('/profile').
Botón ➕: Dispara el modal/vista de subida directamente.
TAREA 2: Chat Transaccional
Función getOrCreateChat(productId, sellerId): Lógica de "singleton" (un chat por producto/comprador).
UI: Cabecera fija (ProductHeader) en el chat con miniatura, título y precio.
Vendedor: Botones "Reservar/Vendido" en la cabecera que ejecutan supabase.from('products').update(...).
TAREA 3: Control de Estados y Visibilidad
Filtro Mercado: Consulta inicial filtrada por state === 'en_venta'.
Botones de Estado: Lógica de bloqueo (si no es en_venta, el botón de contacto se desactiva/oculta).
Refresco de Perfil: Asegurar que las pestañas [En Venta], [Reservados] y [Vendidos] filtran los productos del usuario logueado según su columna state.
⚠️ INSTRUCCIONES PARA EL ASISTENTE
No inventes nombres: Si la columna es seller_id, no uses user_id.
No crees APIs internas: Conecta Supabase directamente.
No uses users: Toda consulta de usuario va a la tabla profiles.
Prioridad: Si hay un error, revisa el esquema SQL real antes de cambiar código al azar.

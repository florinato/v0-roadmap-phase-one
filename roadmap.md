# 🗺️ ROADMAP DE DESARROLLO (Fases de Ejecución)
**Proyecto:** Wallapop Escolar (Thin Client UI)
**Instrucción para la IA:** Este documento divide el proyecto en entregables atómicos. No avances a la siguiente fase sin que el usuario haya validado la fase actual.

---

## FASE 1: El Esqueleto y la Navegación Base (Layout)
**Objetivo:** Crear el contenedor principal de la app y asegurar que el usuario puede moverse entre las pestañas vacías.
**Componentes a crear:**
1. `AppLayout`: Contenedor Mobile-First (`max-w-md`, `h-screen`, `relative`).
2. `BottomNavigationBar`: Menú inferior fijo con 4 iconos (Inicio, Vender, Mensajes, Perfil).
3. **Lógica de estado:** Un `useState` (ej. `activeTab`) que controle qué vista se renderiza en el área principal y resalte el icono activo.
**Criterio de éxito:** Una pantalla móvil interactiva donde pulsar los botones del menú inferior cambia el texto del centro de la pantalla (ej. "Vista Mercado", "Vista Perfil").

---

## FASE 2: Descubrimiento (Tab 1 - Mercado)
**Objetivo:** Construir la portada donde los padres ven qué hay disponible.
**Componentes a crear:**
1. `SearchBar`: Input fijo en la parte superior.
2. `CategoryFilters`: Scroll horizontal oculto con "Pills" (Todos, Libros, Uniformes...).
3. `ProductCard`: Tarjeta reutilizable (Imagen, Título truncado, Precio, Curso).
4. `MarketView`: El grid que junta el buscador, los filtros y mapea un array `mockProducts` de al menos 6 ítems.
**Criterio de éxito:** Un feed visualmente idéntico a Wallapop, con scroll vertical para ver las tarjetas.

---

## FASE 3: Ficha de Producto y Confianza (Product Detail)
**Objetivo:** La vista ampliada cuando alguien toca un producto en el Mercado.
**Componentes a crear:**
1. `ProductDetail`: Vista a pantalla completa (oculta la BottomNav cuando está abierta).
2. `ImageGallery`: Carrusel superior o imagen grande fija.
3. `SellerBadge`: Tarjeta horizontal que muestra el Avatar, Nombre y Estrellas (ej. 4.8) del vendedor.
4. `StickyContactButton`: Botón inferior pegado ("Contactar").
**Criterio de éxito:** Al tocar un producto en la Fase 2, se abre esta vista con los datos correspondientes al producto (vía mocks). El botón "Atrás" devuelve al Mercado.

---

## FASE 4: Flujo de Venta (Tab 2 - Subir Artículo)
**Objetivo:** Un formulario ultra-rápido para fomentar que los padres suban cosas.
**Componentes a crear:**
1. `UploadForm`: Vista principal.
2. `ImageUploaderUI`: Una caja discontinua que simula el área para añadir fotos (icono de cámara).
3. Selectores rápidos (`select` o `dropdowns` limpios) para: Categoría, Curso y Estado.
4. Input numérico gigante para el Precio.
**Criterio de éxito:** Una interfaz fluida donde todo cabe casi en una sola pantalla, terminando en un botón grande "Publicar Anuncio".

---

## FASE 5: El Motor Transaccional (Tab 3 - Mensajes)
**Objetivo:** El sistema de chat contextual (estilo Wallapop). *Esta es la fase más técnica.*
**Componentes a crear:**
1. `InboxView`: Lista general de conversaciones (Foto + miniatura del producto + último mensaje).
2. `ChatRoom`: Vista interna del chat.
3. `ChatHeader`: **Crucial.** Cabecera pegada arriba con la foto del producto, título y precio.
4. `StateActionButtons`: Botones en la cabecera para el vendedor ("Reservar", "Vendido").
5. `MessageList` e `InputBar`: Burbujas de chat y barra para escribir.
**Criterio de éxito:** Poder entrar de la bandeja a un chat y ver claramente de qué producto se está hablando gracias a la cabecera fija.

---

## FASE 6: Gestión de Inventario (Tab 4 - Perfil)
**Objetivo:** Donde el usuario gestiona su reputación y sus artículos.
**Componentes a crear:**
1. `ProfileHeader`: Avatar grande, Nombre, Estrellas y número de valoraciones.
2. `SegmentedControl`: Botonera horizontal (En Venta | Reservados | Vendidos).
3. `InventoryList`: Lista en filas (no en grid) de los artículos del usuario.
   - Si está en "En Venta", añadir un badge de "X interesados" (chats abiertos).
   - Botón de 3 puntos (Opciones) para simular editar o borrar.
**Criterio de éxito:** Un panel de control claro donde el vendedor vea qué le queda por vender y qué tiene bloqueado (reservado).

---

## FASE 7: El Muro (Onboarding & Auth)
*(Nota: Se deja para el final porque a nivel visual es lo más sencillo y permite probar la app principal primero).*
**Objetivo:** La puerta de entrada cerrada del colegio.
**Componentes a crear:**
1. `LoginView`: Logo del colegio, Input de Email/Código y botón "Entrar".
2. `SetupView`: Pantalla para usuarios nuevos donde eligen "Cursos de mis hijos" (para personalizar el Mercado).
**Criterio de éxito:** Una interfaz de login pulida que anteceda a la Fase 1.
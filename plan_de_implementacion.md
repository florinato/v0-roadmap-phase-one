# Plan de Implementación de Funcionalidades de Perfil y Chat

Este documento detalla el plan de trabajo para implementar las funcionalidades de perfil de usuario y chat transaccional, siguiendo las especificaciones del "Wallapop Escolar".

## 1. Funcionalidad de Perfil (ProfileView)

- [ ] **Mostrar información del usuario:**
    - Integrar `ProfileView` para mostrar avatar, nombre, puntuación y número de reseñas. Estos datos se obtendrán de la tabla `public.profiles`.

- [ ] **Control de Inventario (`InventoryList`):**
    - Implementar navegación por pestañas (`SegmentedControl`) para filtrar productos del usuario por estado: "En Venta", "Reservados", "Vendidos".
    - Cada `ProductCard` en la lista debe mostrar imagen, nombre, precio y estado.
    - Para productos "En Venta", añadir botones de "Editar" (detalles/precio/descripción) y "Eliminar" anuncio.

- [ ] **Edición de Perfil (`EditProfileModal`):**
    - Habilitar la edición de perfil a través de un modal (`EditProfileModal`) que permita actualizar nombre, biografía y avatar.
    - Guardar los cambios en la tabla `public.profiles`.

## 2. Funcionalidad de Chat (ChatRoom, InboxView)

- [ ] **Bandeja de Entrada (`InboxView`):**
    - Listar conversaciones activas del usuario. Cada fila de chat debe mostrar avatar del interlocutor, miniatura del producto, título del producto y fragmento del último mensaje.
    - Al hacer clic en una conversación, navegar a la `ChatRoom` correspondiente.

- [ ] **Sala de Chat (`ChatRoom`):**
    - **Cabecera del Producto (`ChatHeader`):** Mostrar imagen, título y precio del producto asociado al chat.
    - **Herramientas del Vendedor:** Si el usuario es el vendedor del producto:
        - Botón "Reservar": Actualizar `state` del producto a 'reservado' en `public.products` y añadir mensaje automático al chat.
        - Botón "Marcar como Vendido": Actualizar `state` del producto a 'vendido' en `public.products`, añadir mensaje automático y disparar `ReviewModal` para la valoración del comprador al vendedor.
    - **Área de Mensajes (`MessageList`):** Mostrar mensajes en burbujas (enviados/recibidos).
    - **Entrada de Texto (`InputBar`):** Permitir escribir y enviar mensajes, guardándolos en `public.messages`.

- [ ] **Iniciar un Chat desde Ficha de Producto (`ProductDetail`):**
    - Al pulsar "Contactar" en `ProductDetail`, verificar si ya existe un chat para ese producto y comprador.
    - Si no existe, crear una nueva entrada en `public.messages` (opcionalmente con un mensaje inicial) y redirigir a la `ChatRoom`.

---

## Estado de las Tareas:

- [ ] **Funcionalidad de Perfil:**
    - [x] Mostrar información del usuario en `ProfileView`.
    - [x] Implementar `SegmentedControl` para el inventario en `InventoryList`.
    - [x] Mostrar detalles del producto en `InventoryList` (`ProductCard`).
    - [x] Añadir botones "Editar" y "Eliminar" en `InventoryList` para productos "En Venta".
    - [x] Implementar `EditProfileModal` para la edición de perfil.
    - [ ] Guardar cambios de perfil en `public.profiles`.

- [ ] **Funcionalidad de Chat:**
    - [ ] Implementar `InboxView` para listar conversaciones.
    - [ ] Navegar de `InboxView` a `ChatRoom`.
    - [ ] Implementar `ChatHeader` en `ChatRoom`.
    - [ ] Implementar herramientas del vendedor en `ChatRoom` (Reservar/Vendido).
    - [ ] Mostrar mensajes en `MessageList`.
    - [ ] Implementar `InputBar` para enviar mensajes.
    - [ ] Iniciar chat desde `ProductDetail` (`Contactar` botón).
- [x] **Verificar navegación a detalle de producto:**
    - [x] Examinar `app/page.tsx` para ver si las imágenes de los productos abren el detalle del producto.
    - [x] Examinar `components/ProductCard.tsx` para ver si las imágenes de los productos abren el detalle del producto.
    - [x] Informar al usuario sobre el hallazgo.
- [x] **Diagnóstico de navegación de productos:**
    - [x] Investigar `components/MarketView.tsx` para entender cómo se pasa la ID del producto a `onProductTap`.
    - [x] Revisar cómo `selectedProduct` y `selectedSeller` se cargan en `app/page.tsx`.
    - [x] Corregir la lógica para que el detalle del producto se abra correctamente.
- [x] **Corregir error de tipo en Supabase select:**
    - [x] Modificar `.select()` en `app/page.tsx` para usar la sintaxis correcta de unión.
    - [x] Ajustar la lógica de extracción de datos del vendedor.

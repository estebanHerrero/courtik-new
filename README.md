# Courtik 🏓

Aplicación móvil para **alquiler de canchas de pádel**, desarrollada con **React Native + Expo** y **Supabase** como backend.

## 1. Descripción breve de las pantallas

### 1.1. Pantalla de Login

- Logo de la app y saludo inicial (“Hola, bienvenido”).
- Campos de:
  - Correo electrónico.
  - Contraseña (con botón para mostrar/ocultar).
- Botón **“Ingresar”** que realiza login con **Supabase Auth (email/contraseña)**.
- Botón **“Ingresar con Google”** (diseñado y maquetado, integración técnica con OAuth en progreso).
- Link **“¿No tenés cuenta?”** que navega a la pantalla de registro.

### 1.2. Pantalla de Registro

- Campos para:
  - Correo electrónico.
  - Contraseña.
- Validación básica de campos vacíos / formato de email.
- Botón **“Registrarme”** que crea el usuario en **Supabase Auth**.
- Mensajes de error legibles si el email ya existe o los datos son inválidos.
- Al registrarse correctamente, se muestra un mensaje de confirmación.

### 1.3. Pantalla Home

- Bienvenida al usuario.
- Acceso principal a:
  - **Listado de canchas** disponibles.
  - Navegación a la pantalla de **reservas**.


### 1.4. Pantalla de Listado de Canchas

- Muestra las canchas obtenidas desde **Supabase** (tabla en la base de datos).
- Cada ítem de cancha incluye:
  - Nombre.
  - Ubicación.
  - Tipo de superficie / características
  - + Características en Info
- Posibilidad de seleccionar una cancha para avanzar a la reserva.

### 1.5. Pantalla de Reservas

- Permite elegir:
  - **Cancha**.
  - **Fecha** y **hora** de la reserva.
- Validaciones de:
  - Campos obligatorios.
- Mensajes de éxito / error luego de guardar.

---

### Notificaciones locales

Se implementó una notificación local usando `expo-notifications`:

- Al abrir la app, se piden permisos de notificación al usuario.
- Si los concede, se programa un recordatorio que muestra un mensaje:
  **“¡No te olvides de reservar tu cancha esta semana!”**.
- Para la demo se configuró como disparo a los X segundos, pero el código está preparado para usar un horario diario (por ejemplo todos los días a las 10:00).

## 2. Capturas de pantalla

A continuación se listan las capturas principales de la app (todas tomadas desde el emulador de Android):

   2.1 **Login**

   ![Pantalla de login](/login.png)
    
   2.2 **Registro de usuario**

   ![Pantalla de registro](/register.png)
    
   2.3 **Home**

   ![Home](/home.png)
    
   2.4 **Pantalla de reserva**

   ![Pantalla de reserva](/reservas.png)

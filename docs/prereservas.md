# Pre-reservas desde la web

Cuando alguien envía el formulario de reserva en la web, las fechas quedan **apartadas** en la base de
datos como una reserva **pendiente de aprobación**. Así, si dos personas piden las mismas fechas, gana la
primera: a la segunda la web le avisa que ya no quedan casas libres.

## Cómo funciona

- **Casa asignada:** en las casas de 1 dormitorio se asigna la primera libre en orden **Verde → Azul →
  Roja**. La Mostaza es una sola.
- **Sin vencimiento:** la pre-reserva queda pendiente hasta que la confirmes o la rechaces en la app de
  reservas.
- **En la web:** las fechas apartadas se ven ocupadas en el calendario de disponibilidad.
- **Email:** sigue llegando el email de Netlify, con la casa asignada.
- **App de reservas:** las pendientes se ven en violeta con rayas y en la sección **Pendientes de
  aprobación**. Al tocarlas se pueden **Confirmar**, **Editar** (casa, precio, seña) o **Rechazar**
  (se borra y las fechas quedan libres). No cuentan en la ocupación ni en los ingresos hasta confirmarlas.
- **Telegram:** te llega un mensaje con casa, fechas, personas, nombre, teléfono y total estimado.
- **Seguridad:** la web solo puede *crear* pre-reservas: nunca ve datos de huéspedes. Hay un límite
  contra abusos: hasta 3 pendientes por teléfono y 30 en total.
- **Si Supabase falla:** el pedido igual llega por email (como antes), sin apartar las fechas.

El código está en:
- `supabase/prereservas.sql`: columna `estado`, función `solicitar_reserva` y aviso por Telegram.
- `components/sections/Disponibilidad.tsx` y `lib/disponibilidad.ts` (`solicitarReserva`): la web.
- Repositorio `gmeringolo/posada-reservas`: la app de reservas.

## Puesta en marcha (una sola vez, en este orden)

### 1. Base de datos

1. En **Supabase**, abrí el proyecto `posada-reservas` y andá a **SQL Editor → New query**.
2. Copiá todo el contenido de `supabase/prereservas.sql`, pegalo y tocá **Run**. Tiene que decir
   *Success*.

Se puede volver a ejecutar sin perder datos. Las reservas que ya existen quedan como confirmadas.

### 2. App de reservas

Publicá los cambios de `posada-reservas` (Netlify lo hace solo al llegar a su rama principal). Abrí la app y
comprobá que todo se ve como siempre.

### 3. Web

Publicá los cambios de este repositorio (al llegar a `master`).

### 4. Aviso por Telegram

1. En Telegram, abrí un chat con **@BotFather**, mandale `/newbot` y seguí los pasos: un nombre (por
   ejemplo *Posada Horizonte Reservas*) y un usuario que termine en `bot` (por ejemplo
   `posadahorizonte_reservas_bot`). BotFather te da un **token** como `123456789:AA...`.
   **Guardalo como una contraseña:** quien lo tenga puede mandar mensajes como tu bot.
2. Abrí el chat con tu bot nuevo y mandale cualquier mensaje (por ejemplo *hola*).
   - Para que el aviso les llegue a dos personas: creá un grupo de Telegram, agregá a las dos y al bot,
     y mandá un mensaje en el grupo.
3. En el navegador, abrí `https://api.telegram.org/botTOKEN/getUpdates` (reemplazando `TOKEN` por el
   token). Buscá `"chat":{"id":` y copiá el número que sigue: es el **número de chat** (en un grupo
   empieza con `-`).
4. En Supabase, **SQL Editor → New query**, pegá esto con tus datos y tocá **Run**:

   ```sql
   select vault.create_secret('TOKEN-DEL-BOT', 'telegram_bot_token');
   select vault.create_secret('NUMERO-DE-CHAT', 'telegram_chat_id');
   ```

   Después borrá ese texto del editor (no lo guardes como consulta).

   Para cambiarlos más adelante: **Project Settings → Vault → Secrets**.

### 5. Probar

1. En la web, pedí una reserva de prueba con fechas libres.
2. Tiene que:
   - aparecer *"Te apartamos las fechas"*;
   - llegar el mensaje de Telegram;
   - verse la pendiente en violeta en la app de reservas.
3. Rechazala desde la app para liberar las fechas.

## Si algo no anda

- **No llega el Telegram:** revisá que el token y el número de chat estén bien en **Vault** y que le
  hayas mandado un mensaje al bot. En **SQL Editor** podés ver los últimos intentos con
  `select status_code, content from net._http_response order by created desc limit 5;`.
- **La web dice que se envió pero no aparta las fechas:** falta ejecutar `supabase/prereservas.sql`.

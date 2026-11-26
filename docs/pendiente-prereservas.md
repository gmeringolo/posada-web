# Pendiente: pre-reservas desde la web

> Nota para retomar más adelante (noviembre de 2026). Antes de hacerlo, queremos ver cómo funciona
> la consulta de reserva tal como está hoy.

## Problema

Hoy el formulario de reserva de la web es solo una consulta: llega por email (Netlify Forms), pero no se
guarda en la base de datos ni bloquea las fechas. Si dos personas piden las mismas fechas, las dos ven
"libre" y hay que decidir a mano a quién darle prioridad.

## Lo que se decidió

- **Al enviar el formulario de reserva**, se guarda una pre-reserva en la tabla `reservas` de Supabase
  con estado *pendiente*. Además sigue llegando el email de Netlify.
- **Sin vencimiento:** la pre-reserva queda pendiente hasta que se confirme o se rechace desde la app
  de reservas.
- **Casas de 1 dormitorio:** se asigna una casa libre en orden **Verde → Azul → Roja**, siempre la Verde
  primero si está libre.
- **Si dos personas piden las mismas fechas,** gana la primera. La regla `sin_superposicion` de la tabla
  `reservas` ya rechaza la segunda, y la web le muestra un aviso como "Estas fechas se acaban de pedir,
  probá otras o escribinos por WhatsApp".
- **El calendario de la web** muestra las pendientes como ocupadas.
- **App de reservas (`gmeringolo/posada-reservas`):** las pendientes aparecen en otro color, como
  "pendiente de aprobación", con los botones **Confirmar** y **Rechazar**. Gracias al tiempo real que ya
  tiene la app, aparecen al instante.

## Cómo se haría

1. **Base de datos:** agregar a `reservas` una columna `estado` (`confirmada` / `pendiente`); las
   reservas actuales quedan como confirmadas.
2. **Función nueva en Supabase** (por ejemplo `solicitar_reserva`), con permiso solo para crear
   pre-reservas: la web nunca puede leer datos de huéspedes. La función busca una casa libre en el orden
   indicado, guarda la pre-reserva y devuelve si se pudo o si las fechas ya estaban tomadas.
3. **Web (este repositorio):**
   - El formulario de reserva llama a esa función, además de enviar el email.
   - Mostrar el mensaje correspondiente si las fechas ya se tomaron.
   - La función `disponibilidad` (en `supabase/disponibilidad.sql`) ya devuelve todas las filas de
     `reservas`, así que las pendientes se verían ocupadas sin más cambios.
4. **App de reservas:**
   - Mostrar las pendientes con otro color.
   - Agregar los botones Confirmar (pasa a `confirmada`) y Rechazar (borra la pre-reserva).

## Falta resolver

- **Aviso al celular de cada pre-reserva nueva.** La opción recomendada es Telegram: crear un bot propio
  y que Supabase le mande un mensaje en cada pre-reserva (casa, fechas, noches, personas y nombre), con
  un enlace a la app de reservas. El token del bot y el número de chat se guardan en Supabase, nunca en
  el código. Las alternativas son ntfy (más simple, pero el canal es público si se adivina el nombre) o
  notificaciones de la propia app de reservas (más trabajo; en iPhone solo funciona con la app agregada
  a la pantalla de inicio).
- **Cómo se hacen los cambios en `posada-reservas`:** dar permiso de escritura a la sesión de Claude, o
  que Claude pase los cambios para subirlos a mano.
- **Riesgo a tener en cuenta:** sin vencimiento, una reserva falsa deja fechas bloqueadas hasta que se
  rechace. Con el aviso al celular se detecta enseguida.

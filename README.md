# Posada Horizonte · web

Web one page de **Posada Horizonte** (posadahorizonteuy.com): casas en alquiler en Bello Horizonte, Canelones.

- **Tecnología:** Next.js + TypeScript + Tailwind CSS, exportada como sitio estático.
- **Hosting:** Netlify (carpeta `out/`).
- **Formulario:** Netlify Forms.
- **Disponibilidad:** se lee en vivo de la app **Posada reservas** (Supabase).
- **Medición:** Google Analytics 4 (se activa al cargar el ID).

---

## Probarla en tu compu

```bash
npm install
npm run dev        # abre http://localhost:3000
```

Otros comandos:

| Comando | Para qué sirve |
|---|---|
| `npm run build` | Arma la web final en la carpeta `out/` (lo mismo que hace Netlify) |
| `npm test` | Prueba el cálculo de precios y la disponibilidad |
| `npm run lint` | Revisa el código |

> El formulario de contacto solo funciona una vez publicado en Netlify. En tu compu muestra un error al enviar; es normal.

---

## Cómo está organizado

```
app/
  page.tsx            ← la página: solo une las secciones en orden
  layout.tsx          ← título, descripción, datos para Google, fuentes
components/
  sections/           ← una sección por archivo
    Hero.tsx  Casas.tsx  Servicios.tsx  IdealPara.tsx  Galeria.tsx
    Opiniones.tsx  Tarifas.tsx  Disponibilidad.tsx  LaZona.tsx
    PreguntasFrecuentes.tsx  Contacto.tsx
  layout/             ← menú, pie, botón de WhatsApp, Analytics
  ui/                 ← botones, logo, íconos
data/
  site.ts             ← TODOS los textos, precios, opiniones y preguntas
  fotos.ts            ← la lista de fotos de la galería
lib/                  ← cálculo de precio, disponibilidad, fechas
public/
  images/  videos/    ← fotos (WebP) y videos
  __forms.html        ← formulario "fantasma" que lee Netlify
supabase/
  disponibilidad.sql  ← función para la consulta de disponibilidad
```

---

## Editar el contenido

Todo se edita en **`data/site.ts`**. Si un dato queda vacío (`""` o `[]`), ese bloque **no aparece** en la web. Los datos pendientes están marcados con `TODO confirmar`.

- **Precios:** lista `tarifas`. Cada período tiene fechas `"MM-DD"` (desde y hasta, inclusive) y precio por noche. La sección Tarifas y el precio estimado de Disponibilidad usan la misma lista: se cambia en un solo lugar.
- **Promo de primavera:** lista `promos`.
- **Precios fuera de temporada:** `preciosFueraDeTemporada`.
- **Check-in, seña, cancelación, mascotas:** `antesDeReservar`.
- **Opiniones:** `opiniones` (solo reales, copiadas de Google o Airbnb) y `calificaciones` (promedio y cantidad; con `promedio: 0` no se muestra).
- **Preguntas frecuentes:** `preguntasFrecuentes` (las que no tienen respuesta no se muestran).
- **La zona:** `zona` (distancias, qué hacer cerca, cómo llegar en ómnibus).
- **Teléfono / WhatsApp:** `negocio`. Es un único número para toda la web.

### Agregar fotos

1. Convertí la foto a **WebP** en dos tamaños: una grande (máx. 1600 px) y una chica (máx. 720 px) terminada en `-sm.webp`. Por ejemplo `playa.webp` y `playa-sm.webp`.
2. Copialas en `public/images/<carpeta>/` (`casas-1dorm`, `mostaza`, `exterior` o `zona`).
3. Agregá una línea en `data/fotos.ts` con la ruta, el ancho y alto, la categoría y un texto descriptivo (`alt`).

La categoría `zona` activa sola el filtro "La playa y la zona" de la galería.

---

## Configuración en Netlify

El archivo `netlify.toml` ya le dice a Netlify cómo armar la web (`npm run build`, carpeta `out`) y redirige `www` y `http` al dominio principal.

### Formulario (Netlify Forms)

1. Después del primer deploy, entrá a **Forms** en Netlify: tiene que aparecer el formulario **consulta**. Si no aparece, revisá en *Site configuration → Forms* que la detección de formularios esté activada y volvé a publicar.
2. Para recibir cada consulta por email: **Site configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**, elegí el formulario `consulta` y poné el email.
3. Si agregás un campo al formulario (`components/sections/Contacto.tsx`), agregalo también en `public/__forms.html`.

### Google Analytics 4

1. En [analytics.google.com](https://analytics.google.com) creá una propiedad para posadahorizonteuy.com y un flujo de datos web.
2. Copiá el **ID de medición** (empieza con `G-`).
3. En Netlify: **Site configuration → Environment variables → Add a variable** → nombre `NEXT_PUBLIC_GA_ID`, valor el ID. Después **Deploys → Trigger deploy**.

Mientras no esté el ID, Analytics no se carga y no aparece el aviso de cookies. Con el ID, Analytics se carga **solo si el visitante acepta** las cookies.

**Eventos que se miden:** `whatsapp_click` (con dónde se tocó), `form_submit`, `availability_check` (fechas, noches, casas libres y precio), `gallery_open`, `video_play`, `review_link_click` y `directions_click`.
En GA4, entrá a **Administrar → Eventos** y marcá `whatsapp_click` y `form_submit` como **eventos clave**: son las consultas que genera la web.

### Consulta de disponibilidad (Supabase)

La web lee las fechas ocupadas de la app **Posada reservas**, sin ver datos de huéspedes.

1. En Supabase, proyecto `posada-reservas` → **SQL Editor → New query**.
2. Pegá el contenido de `supabase/disponibilidad.sql` y tocá **Run**.
3. Listo: la dirección del proyecto y la clave pública *anon* ya están en `data/site.ts` (son las mismas que usa la app). Si algún día cambian, podés cargarlas en Netlify como `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Si la función no existe o Supabase no responde, la sección muestra el precio estimado y el botón de WhatsApp, sin romper la página.

---

## Checklist de lanzamiento

- [ ] Ejecutar `supabase/disponibilidad.sql` en Supabase y probar una consulta con una reserva cargada.
- [ ] Configurar el email de aviso de Netlify Forms y mandar un formulario de prueba.
- [ ] Probar los botones de WhatsApp desde un celular.
- [ ] Cargar `NEXT_PUBLIC_GA_ID` y verificar en GA4 (*Informes → Tiempo real*) que llegan los eventos.
- [ ] **Perfil de Empresa de Google:** verificar que la ficha esté reclamada; poner la web, el WhatsApp y fotos nuevas; responder todas las opiniones.
- [ ] **Pedir opiniones:** después de cada estadía, mandar por WhatsApp el link de "Pedir opiniones" del Perfil de Empresa. Cargar ese link en `enlaces.escribirOpinionGoogle` para que aparezca el botón en la web.
- [ ] **Google Search Console:** dar de alta el dominio y enviar `https://posadahorizonteuy.com/sitemap.xml`.
- [ ] Instagram y Facebook: link a la web en la bio.
- [ ] Completar los datos marcados con `TODO confirmar` en `data/site.ts`.

---

## Fase 2 (ideas para más adelante)

- Versión en portugués para turistas brasileños.
- Sincronizar el calendario de la app con Airbnb y Booking (iCal) para no reservar dos veces la misma casa.
- Guardar las consultas del formulario también en Supabase.

---

Diseño y desarrollo: Gianella Meringolo.

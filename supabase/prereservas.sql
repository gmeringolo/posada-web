-- =====================================================================
--  Pre-reservas desde la web posadahorizonteuy.com
--  Ejecutar en Supabase → SQL Editor → New query → Run
--  (proyecto posada-reservas, el mismo de la app de reservas).
--  Se puede volver a ejecutar sin perder datos.
--
--  Qué hace:
--  1. Agrega a la tabla `reservas` la columna `estado`: 'confirmada' (las de
--     siempre) o 'pendiente' (pedidas desde la web, falta aprobarlas).
--  2. Crea la función `solicitar_reserva`, que usa la web al enviar el
--     formulario de reserva. Asigna una casa libre (1 dormitorio: Verde,
--     después Azul, después Roja) y guarda la pre-reserva como pendiente.
--     Si dos personas piden las mismas fechas, gana la primera: la regla
--     `sin_superposicion` de la tabla rechaza la segunda.
--     La web solo puede CREAR pre-reservas: nunca ve datos de nadie.
--  3. Avisa por Telegram cada pre-reserva nueva (si están cargados el
--     token del bot y el número de chat; ver docs/prereservas.md).
-- =====================================================================

-- 1) Estado de cada reserva
alter table public.reservas add column if not exists estado text not null default 'confirmada';
alter table public.reservas drop constraint if exists reservas_estado_valido;
alter table public.reservas add constraint reservas_estado_valido check (estado in ('confirmada', 'pendiente'));

-- 2) Pre-reserva desde la web
create or replace function public.solicitar_reserva(
  p_tipo         text,     -- '1dorm' o 'mostaza'
  p_inicio       date,
  p_fin          date,
  p_nombre       text,
  p_telefono     text,
  p_adultos      integer,
  p_ninos        integer,
  p_mascotas     integer,
  p_moneda       text    default null,  -- precio estimado por la web (se puede corregir al confirmar)
  p_precio_noche numeric default null,
  p_total        numeric default null,
  p_comentarios  text    default null
)
returns text            -- casa asignada: 'verde', 'azul', 'roja' o 'mostaza'
language plpgsql
security definer
set search_path = public
as $$
declare
  v_casas  text[];
  v_casa   text;
  v_nombre text := btrim(coalesce(p_nombre, ''));
  v_tel    text := btrim(coalesce(p_telefono, ''));
  v_digitos text := regexp_replace(coalesce(p_telefono, ''), '\D', '', 'g');
  v_moneda text := case when p_moneda in ('USD', 'UYU') then p_moneda else 'USD' end;
begin
  -- Orden en que se asignan las casas
  if p_tipo = '1dorm' then
    v_casas := array['verde', 'azul', 'roja'];
  elsif p_tipo = 'mostaza' then
    v_casas := array['mostaza'];
  else
    raise exception 'Tipo de casa no válido' using errcode = 'PH011';
  end if;

  -- Datos válidos (la web ya los controla; esto es por si alguien llama a la función a mano)
  if p_inicio is null or p_fin is null or p_fin <= p_inicio or p_inicio < current_date
     or p_fin - p_inicio > 90 or p_inicio > current_date + 548 then
    raise exception 'Fechas no válidas' using errcode = 'PH011';
  end if;
  if length(v_nombre) not between 2 and 120 or length(v_digitos) not between 6 and 20 then
    raise exception 'Nombre o teléfono no válidos' using errcode = 'PH011';
  end if;
  if coalesce(p_adultos, 0) < 1 or coalesce(p_ninos, 0) < 0 or coalesce(p_mascotas, 0) < 0
     or coalesce(p_adultos, 0) + coalesce(p_ninos, 0) > 4 or coalesce(p_mascotas, 0) > 5 then
    raise exception 'Cantidad de personas no válida' using errcode = 'PH011';
  end if;

  -- Contra el abuso: hasta 3 pendientes por teléfono y 30 en total
  if (select count(*) from public.reservas
      where estado = 'pendiente' and regexp_replace(telefono, '\D', '', 'g') = v_digitos) >= 3
     or (select count(*) from public.reservas where estado = 'pendiente') >= 30 then
    raise exception 'Demasiadas pre-reservas pendientes' using errcode = 'PH012';
  end if;

  -- Primera casa libre, en orden. Si otra reserva ocupa esas fechas, la regla
  -- sin_superposicion rechaza el insert y se prueba con la siguiente casa.
  foreach v_casa in array v_casas loop
    begin
      insert into public.reservas
        (casa, inicio, fin, nombre, apellido, telefono, moneda, precio_noche, total,
         adultos, ninos, mascotas, comentarios, estado)
      values
        (v_casa, p_inicio, p_fin, v_nombre, null, v_tel, v_moneda,
         case when p_precio_noche > 0 then p_precio_noche end,
         case when p_total > 0 then p_total end,
         p_adultos, coalesce(p_ninos, 0), coalesce(p_mascotas, 0),
         left(nullif(btrim(coalesce(p_comentarios, '')), ''), 1000), 'pendiente');
      return v_casa;
    exception when exclusion_violation then
      null; -- ocupada: probar la siguiente
    end;
  end loop;

  raise exception 'No hay casas libres en esas fechas' using errcode = 'PH020';
end
$$;

revoke all on function public.solicitar_reserva(text, date, date, text, text, integer, integer, integer, text, numeric, numeric, text) from public;
grant execute on function public.solicitar_reserva(text, date, date, text, text, integer, integer, integer, text, numeric, numeric, text) to anon, authenticated;

-- 3) Aviso por Telegram de cada pre-reserva nueva
--    El token del bot y el número de chat se guardan en el Vault de Supabase
--    (nunca en el código). Si no están cargados, no se avisa y la pre-reserva
--    se guarda igual. Si Telegram falla, la pre-reserva también se guarda igual.
create extension if not exists pg_net;

create or replace function public.avisar_prereserva()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token text;
  v_chat  text;
  v_texto text;
  v_noches integer := new.fin - new.inicio;
begin
  begin
    select decrypted_secret into v_token from vault.decrypted_secrets where name = 'telegram_bot_token';
    select decrypted_secret into v_chat  from vault.decrypted_secrets where name = 'telegram_chat_id';
    if v_token is null or v_chat is null then
      return new;
    end if;

    v_texto := concat_ws(E'\n',
      '🏡 Nueva reserva desde la web (pendiente de aprobación)',
      'Casa ' || initcap(new.casa) || ' · ' || to_char(new.inicio, 'DD/MM') || ' al ' || to_char(new.fin, 'DD/MM')
        || ' · ' || v_noches || case when v_noches = 1 then ' noche' else ' noches' end,
      new.adultos || ' adultos · ' || new.ninos || ' menores · ' || new.mascotas || ' mascotas',
      new.nombre || ' · ' || new.telefono,
      case when new.total is not null then 'Total estimado: ' || case when new.moneda = 'UYU' then '$ ' else 'US$ ' end || trim_scale(new.total) end,
      case when new.comentarios is not null then 'Mensaje: ' || new.comentarios end,
      '',
      'Confirmala o rechazala en la app de reservas.'
    );

    perform net.http_post(
      url     := 'https://api.telegram.org/bot' || v_token || '/sendMessage',
      body    := jsonb_build_object('chat_id', v_chat, 'text', v_texto),
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  exception when others then
    raise warning 'No se pudo avisar por Telegram: %', sqlerrm;
  end;
  return new;
end
$$;

revoke all on function public.avisar_prereserva() from public, anon, authenticated;

drop trigger if exists avisar_prereserva on public.reservas;
create trigger avisar_prereserva
  after insert on public.reservas
  for each row when (new.estado = 'pendiente')
  execute function public.avisar_prereserva();

-- Para probar (con una fecha futura libre); después borrala desde la app:
-- select public.solicitar_reserva('1dorm', current_date + 30, current_date + 32, 'Prueba', '099123456', 2, 0, 0);

-- =====================================================================
--  Disponibilidad pública para la web posadahorizonteuy.com
--  Ejecutar UNA vez en Supabase → SQL Editor → New query → Run
--  (proyecto posada-reservas, el mismo de la app de reservas)
--
--  La tabla `reservas` sigue privada: solo la ve quien entra con login.
--  Esta función devuelve ÚNICAMENTE casa y fechas (nunca nombres,
--  teléfonos ni pagos), sin nada del pasado y hasta ~18 meses adelante.
-- =====================================================================

create or replace function public.disponibilidad(desde date, hasta date)
returns table (casa text, inicio date, fin date)
language sql
stable
security definer
set search_path = public
as $$
  select r.casa, r.inicio, r.fin
  from public.reservas r
  where r.fin > greatest(desde, current_date)          -- nada del pasado
    and r.inicio < least(hasta, current_date + 548)    -- máximo ~18 meses hacia adelante
  order by r.casa, r.inicio;
$$;

revoke all on function public.disponibilidad(date, date) from public;
grant execute on function public.disponibilidad(date, date) to anon, authenticated;

-- Para probar: tiene que devolver solo casa, inicio y fin.
-- select * from public.disponibilidad(current_date, current_date + 365);

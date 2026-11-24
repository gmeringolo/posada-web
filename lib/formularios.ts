/**
 * Envía un formulario a Netlify Forms (cada envío llega por email según
 * la configuración de notificaciones de Netlify).
 * El formulario tiene que tener el campo oculto "form-name" y estar
 * declarado también en public/__forms.html.
 */
export async function enviarFormularioNetlify(form: HTMLFormElement): Promise<void> {
  const datos = new FormData(form);
  const body = new URLSearchParams(datos as unknown as Record<string, string>).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(String(res.status));
}

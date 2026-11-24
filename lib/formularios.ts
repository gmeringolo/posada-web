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

/**
 * Texto del error al enviar. En la compu (npm run dev) Netlify Forms no existe,
 * así que el envío siempre falla: lo aclaramos para no confundir al probar.
 */
export const MENSAJE_ERROR_ENVIO =
  process.env.NODE_ENV === "development"
    ? "En tu compu (npm run dev) los formularios no se pueden enviar: probalo en la web publicada en Netlify."
    : "No pudimos enviar tu consulta. Probá de nuevo en unos minutos o escribinos por WhatsApp.";

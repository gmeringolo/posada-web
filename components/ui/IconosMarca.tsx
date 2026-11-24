import { siAirbnb, siFacebook, siGoogle, siInstagram, siWhatsapp } from "simple-icons";

type Props = { className?: string; color?: string };

function crear(path: string) {
  return function IconoMarca({ className = "size-5", color = "currentColor" }: Props) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill={color} aria-hidden="true">
        <path d={path} />
      </svg>
    );
  };
}

export const WhatsAppIcon = crear(siWhatsapp.path);
export const InstagramIcon = crear(siInstagram.path);
export const FacebookIcon = crear(siFacebook.path);
export const AirbnbIcon = crear(siAirbnb.path);
export const GoogleIcon = crear(siGoogle.path);

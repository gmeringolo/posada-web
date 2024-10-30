import React from "react";
import styles from "./footer.module.scss";
import logoB from "./3.png";
import Ig from "./instagram.svg";
import Face from "./facebook.svg";
import Whats from "./whatsapp.svg";
import Air from "./airbnb.svg";

function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <a href="#inicio" className={styles.footer_enlace}>
          <img src={logoB} alt="logo posada" />
        </a>
        <div className={styles.footer_contacto}>
          <p>Av 3 esq Rambla. Bello horizonte-Canelones</p>
          <p>092 269 002 (Hector)</p>
          <a href="https://goo.gl/maps/neJxXrmBx4yZpGGEA" target="_blanck">
            <p>Ubicación (google maps)</p>
          </a>
        </div>
        <div className={styles.footer_redes}>
        <a href="https://www.instagram.com/posadahorizonte/" target="_blanck" className={styles.instagram}>
          <img src={Ig} alt="Instagram" />
        </a>
        <a href="https://www.facebook.com/posadahorizonte" target="_blanck" className={styles.facebook}>
          <img src={Face} alt="facebook" />
        </a>
        <a href="https://www.airbnb.com.ar/rooms/707961511570571728?guests=1&adults=1&s=67&unique_share_id=1a37a3d2-2b19-43ba-8470-1c0b86584f83" target="_blanck" className={styles.airbnb}>
          <img src={Air} alt="Airbnb" />
        </a>
        <a href="https://wa.me/+59899667726?text=Para%20consultar%20disponibilidad,%20indicar%20fecha%20de%20entrada%20y%20salida" target="_blanck" className={styles.whatsapp}>
          <img src={Whats} alt="whatsapp" />
        </a>
        </div>
      </footer>
      <div className={styles.copyright}>
        <p>Copyright© 2025 Gianella Meringolo</p>
      </div>
    </>
  );
}

export default Footer;

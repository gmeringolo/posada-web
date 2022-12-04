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
        <a href="https://es-l.airbnb.com/rooms/10986271?adults=2&check_in=2022-12-09&check_out=2022-12-16&source_impression_id=p3_1670102933_Dqk9mqMd9fYEqpcX" target="_blanck" className={styles.airbnb}>
          <img src={Air} alt="Instagram" />
        </a>
        <a href="https://wa.me/+59899667726?text=Para%20consultar%20disponibilidad,%20indicar%20fecha%20de%20entrada%20y%20salida" target="_blanck" className={styles.whatsapp}>
          <img src={Whats} alt="whatsapp" />
        </a>
        </div>
      </footer>
      <div className={styles.copyright}>
        <p>Copyright© 2022 Posada Horizonte</p>
      </div>
    </>
  );
}

export default Footer;

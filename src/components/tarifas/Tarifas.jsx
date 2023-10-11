import React from "react";
import styles from "./tarifas.module.css";
//import promo from "./promo.jpeg";
import precios from "./tarifas.jpg";
import baja from "./baja.png";
import marzo from "./marzo.png";
import turismo from "./turismo.png";
import enero from "./promEnero.jpeg";

function Tarifas() {
  return (
    <>
      <div className={styles.textoTarifas} id="tarifas">
        <h1>Tarifas y Promociones</h1>
        <p>Precios temporada 2023-2024</p>
        <div className={styles.tarifas}>
          <img
            src={baja}
            className={styles.imgTarifas}
            alt="precio temp baja 2023"
          />
          <img src={precios} className={styles.imgTarifas} alt="Tarifas 2024" />
          <img src={enero} className={styles.imgTarifas} alt="Promo enero" />
          <img
            src={marzo}
            className={styles.imgTarifas}
            alt="Precio marzo 2023"
          />
        </div>
      </div>
    </>
  );
}

export default Tarifas;

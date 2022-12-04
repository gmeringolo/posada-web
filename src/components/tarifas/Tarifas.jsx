import React from "react";
import styles from "./tarifas.module.css";
import promo from "./promo.jpeg";
import precios from "./tarifas.jpg";
import baja from "./baja.png";
import marzo from "./marzo.png";
import turismo from "./turismo.png";

function Tarifas() {
  return (
    <>
      <div className={styles.textoTarifas} id="tarifas">
        <h1>Tarifas y Promociones</h1>
        <p>Precios temporada 2022-2023</p>
        <div className={styles.tarifas}>
          <img src={promo} className={styles.imgTarifas} alt="Promo primavera" />
          <img src={precios} className={styles.imgTarifas} alt="Tarifas 2023" />
          <img src={marzo} className={styles.imgTarifas} alt="Precio marzo 2023" />
          <img src={turismo} className={styles.imgTarifas} alt="Precio turismo 2023" />
          <img src={baja} className={styles.imgTarifas} alt="precio temp baja 2023" />
        </div>
      </div>
    </>
  );
}

export default Tarifas;

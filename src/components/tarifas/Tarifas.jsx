import React from "react";
import styles from "./tarifas.module.css";
import precios from "./tarifas25.png";
import baja from "./baja.png";
import marzo from "./marzo.png";
import primavera from "./promo.jpeg";


function Tarifas() {
  return (
    <>
      <div className={styles.textoTarifas} id="tarifas">
        <h1>Tarifas y Promociones</h1>
        <p>Precios temporada 2024</p>
        <div className={styles.tarifas}>

        <img
            src={primavera}
            className={styles.imgTarifas}
            alt="precio primavera 2024"
          />  
          <img src={precios} className={styles.imgTarifas} alt="Tarifas 2025" />
          <img
            src={marzo}
            className={styles.imgTarifas}
            alt="Precio marzo 2025"
          />
          <img
            src={baja}
            className={styles.imgTarifas}
            alt="precio temp baja 2024"
          />    
        </div>
      </div>
    </>
  );
}

export default Tarifas;

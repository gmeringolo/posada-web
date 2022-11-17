import React from 'react';
import styles from "./contacto.module.css";
import ubicacion from "./ubicacion.png";

function Contacto() {
  return (
    <>
    <div className={styles.textoContacto}>
        <h1>Contacto</h1>
        <p>Av 3 esq Rambla. Bello horizonte-Canelones</p>
        <p>092 269 002 (Hector)</p>
        <div className={styles.ubicacion}>
          <img src={ubicacion} className={styles.imgUbicacion} alt="Mapa ubicación" />
          <div className={styles.form}>
            <p>Formulario</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contacto
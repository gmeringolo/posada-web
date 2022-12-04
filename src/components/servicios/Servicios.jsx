import React from "react";
import styles from "./servicios.module.css";
import vista from "./vistaSup.png";
import living from "./living.jpeg";
import dorm from "./dorm.jpeg";
import deck from "./deck.jpeg";

function Servicios() {
  return (
    <>
      <div className={styles.servicios} id="servicios">
        <h1>Servicios</h1>
        <div className={styles.servicios1}>
          <div className={styles.vista}>
            <p className={styles.p1}>
              Cada casa cuenta con 100 m2 techados y de uso exclusivo.
            </p>
          </div>
          <img src={vista} className={styles.img1} alt="vista interior casa" />
        </div>

        <div className={styles.servicios1}>
          <img
            src={living}
            className={styles.img2}
            alt="vista interior living"
          />
          <div className={styles.vista}>
            <p className={styles.p2}>
              Cocina completa integrada. Estar con cama marinera, wifi y
              televisor 32¨con direct tv.
            </p>
          </div>
        </div>

        <div className={styles.servicios1}>
          <div className={styles.vista}>
            <p className={styles.p2}>
              Dormitorio con cama 2 plazas (140x180), aire acondicionado y
              placard
            </p>
          </div>
          <img src={dorm} className={styles.img1} alt="vista interior living" />
        </div>

        <div className={styles.servicios1}>
          <img src={deck} className={styles.img2} alt="vista interior living" />
          <div className={styles.vista}>
            <p className={styles.p1}>
              Deck techado con parrillero pileta, mesa y sillas
            </p>
          </div>
        </div>
        <p className={styles.p}> No incluyen servicio de ropa blanca (sábanas y toallas)</p>
      </div>
    </>
  );
}

export default Servicios;

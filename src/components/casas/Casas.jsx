import React from "react";
import styles from "./casas.module.css";
import azul from "./casa_azul.jpg";
import roja from "./casa_roja.jpg";
import verde from "./casa_verde.jpg";
import video from "./vistaAzul.mp4";
import poster from "./casa_verde_video.jpg";

function Casas() {
  return (
    <>
      <div className={styles.textoCasas} id="casas">
        <h1>Casas</h1>
        <p>
          El predio cuenta con 3 casas de 1 dormitorio, diseñadas para brindarle
          al usuario comodidad e independencia.
        </p>
        <div className={styles.casas}>
          <img src={roja} className={styles.img} alt="casa roja" />
          <img src={azul} className={styles.img} alt="casa azul" />
          <img src={verde} className={styles.img} alt="casa verde" />
        </div>
        <video src={video} type="video/mp4" poster={poster} controls/>
      </div>
    </>
  );
}

export default Casas;

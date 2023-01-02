import React from "react";
import styles from "./home.module.css";
import Header from "../components/header/Header";
import Casas from "../components/casas/Casas";
import Servicios from "../components/servicios/Servicios";
import Tarifas from "../components/tarifas/Tarifas";
import Contacto from "../components/contacto/Contacto";
import Footer from "../components/footer/Footer";
import icono from "./icono.png";

function home() {
  return (
    <>
      <Header />
      <Casas />
      <Servicios />
      <Tarifas />
      <Contacto />

      <div className={styles.containerBoton}>
        <a
          href="https://wa.me/+59896269002?text=Para%20consultar%20disponibilidad,%20indicar%20fecha%20de%20entrada%20y%20salida"
          target="_blank"
          rel="noreferrer"
        >
          <img class={styles.boton} src={icono} alt="" />
        </a>
      </div>
      <Footer />
    </>
  );
}
export default home;

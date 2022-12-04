import React from "react";
import styles from "./contacto.module.css";
//import GoogleMapReact from "google-map-react";
import emailjs from "emailjs-com";
import ubicacion from "./ubicacion.png";

//const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Contacto() {
  function enviarEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        "gmailMessagePosada",
        "template_cygn0vc",
        e.target,
        "HBfDHKzCXsYzN1KoE"
      )
      .then(
        (result) => {
          alert("Mensaje enviado exitosamente!!");
        },
        (error) => {
          alert(error.message);
        }
      );
    e.target.reset();
  }

  /*const defaultProps = {
    center: {
      lat: -34.774915,
      lng: -55.643852,
    },
    zoom: 11,
  };*/
  return (
    <>
      <div className={styles.textoContacto} id="contacto">
        <h1>Contacto</h1>
        <p>Av 3 esq Rambla. Bello horizonte-Canelones</p>
        <p>092 269 002 (Hector)</p>
        <div className={styles.ubicacion}>
          {/*<div className="mapUbicacion"
            style={{
              height: "460px",
              width: "470px",
              margin: "20px 10px 20px 20px",
            }}
          >
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyA3IzZ1MGXTa0GQA7vndmAYo3y-_naCrDY",
              }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              <AnyReactComponent
                lat={-34.774915}
                lng={-55.643852}
                text="Posada Horizonte"
              />
            </GoogleMapReact>
            </div>*/}
          <a href="https://goo.gl/maps/neJxXrmBx4yZpGGEA" target="_blanck"><img
            src={ubicacion}
            className={styles.mapUbicacion}
            alt="Promo primavera"
          /></a>
          <form className={styles.form} onSubmit={enviarEmail}>
            <h2>Formulario</h2>
            <h3>Consulte disponibilidad</h3>
            <label htmlFor="name">Nombre*:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Escriba un nombre de contacto..."
              required
            ></input>
            <label htmlFor="tel">Telefono*:</label>

            <input
              type="tel"
              id="tel"
              name="tel"
              placeholder="Escriba un celular de contacto (9 números)..."
              required
              pattern={9}
            ></input>
            <label htmlFor="msg">Mensaje*:</label>
            <textarea
              type="text"
              id="msg"
              name="msg"
              placeholder="Consulte disponibilidad indicando cantidad de personas, fecha de entrada y salida del alojamiento..."
              required
            ></textarea>
            <button type="submit">Envíar</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contacto;

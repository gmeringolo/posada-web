import React from "react";
import styles from "./contacto.module.css";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import emailjs from "emailjs-com";

function Contacto() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA3IzZ1MGXTa0GQA7vndmAYo3y-_naCrDY",
  });

  const center = {
    lat: -34.774915,
    lng: -55.643852,
  };

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
          <div className={styles.mapUbicacion}>
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center}
                zoom={15}
              >
                <Marker position={center} />
              </GoogleMap>
            )}
          </div>
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
            <label htmlFor="email">Email*:</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Escriba un correo electrónico"
              required
            ></input>
            <label htmlFor="msg">Mensaje*:</label>
            <textarea
              type="text"
              id="msg"
              name="msg"
              placeholder="Consulte disponibilidad indicando cantidad de personas, fecha de entrada y salida del alojamiento..."
              required
            ></textarea>
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contacto;

import React from "react";
import styles from "./contacto.module.css";
import GoogleMapReact from "google-map-react";
//import ubicacion from "./ubicacion.png";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Contacto() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };
  return (
    <>
      <div className={styles.textoContacto}>
        <h1>Contacto</h1>
        <p>Av 3 esq Rambla. Bello horizonte-Canelones</p>
        <p>092 269 002 (Hector)</p>
        <div className={styles.ubicacion}>
          <div style={{ height: '460px', width: '470px', margin: '20px 10px 20px 20px' }}>
            <GoogleMapReact
              bootstrapURLKeys={{key: "AIzaSyA3IzZ1MGXTa0GQA7vndmAYo3y-_naCrDY"}}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              <AnyReactComponent
                lat={-34.774915}
                lng={-55.643852}
                text="Posada Horizonte"
              />
            </GoogleMapReact>
          </div>
          <form className={styles.form}>
            <h2>Formulario</h2>
            <h3>Consulte disponibilidad</h3>
            <p type="Nombre:" className="pCont">
              <input placeholder="Escriba un nombre de contacto.."></input>
            </p>
            <p type="Telefono:" className="pCont">
              <input placeholder="Escriba un telefono de contacto.."></input>
            </p>
            <p type="Mensaje:" className="pCont">
              <textarea placeholder="Consulte disponibilidad indicando fecha de entrada y salida del alojamiento.."></textarea>
            </p>
            <button>Envíar</button>

            {/* <input
                type="text"
                id="fname"
                name="fname"
                value="Nombre completo*"></input>
              <br></br>
              <input type="text" id="tel" name="tel" value="Telefono*"></input>
              <br></br>
              <input type="text" id="email" name="email"></input>
              <br></br>
              <input
                type="date"
                className="fecha"
                name="fentr"
                value="Fecha entrada*"
              ></input>
              <input
                type="date"
                className="fecha"
                name="fsal"
                value="Fecha salida*"
              ></input>
              <br></br>
              <textarea name="textarea" rows="10" cols="50">
                Mensaje
              </textarea>
              <br></br>
              <input type="submit" value="Enviar"></input>*/}
          </form>
        </div>
      </div>
    </>
  );
}

export default Contacto;

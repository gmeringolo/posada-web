import React from "react";
import "./servicios.css";
import vista from "./vistaSup.png";
import living from "./living.jpeg";
import dorm from "./dorm.jpeg";
import deck from "./deck.jpeg";

function Servicios() {
  return (
    <>
      <div className="servicios">
        <h1>Servicios</h1>
        <div className="servicios1">
          <div className="vista">
            <p className="p1">
              Cada casa cuenta con 100 m2 techados y de uso exclusivo.
            </p>
          </div>
          <img src={vista} className="img1" alt="vista interior casa" />
        </div>

        <div className="servicios1">
          <img src={living} className="img2 img2-shadow" alt="vista interior living" />
          <div className="vista2 vista2-shadow">
            <p className="p2">
              Cocina completa integrada. Estar con cama marinera, wifi y
              televisor 32¨con direct tv.
            </p>
          </div>
        </div>

        <div className="servicios1">
          <div className="vista">
            <p className="p2">
              Dormitorio con cama 2 plazas (140x180), aire acondicionado y
              placard
            </p>
          </div>
          <img src={dorm} className="img1" alt="vista interior living" />
        </div>

        <div className="servicios1">
          <img src={deck} className="img2 img2-shadow" alt="vista interior living" />
          <div className="vista2 vista2-shadow">
            <p className="p1">Deck techado con parrillero pileta, mesa y sillas</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Servicios;

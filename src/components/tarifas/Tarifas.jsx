import React from "react";
import "./tarifas.css";
import promo from "./promo.jpeg";
import precios from "./tarifas.jpg";

function Tarifas() {
  return (
    <>
      <div>
        <h1>Tarifas y Promociones</h1>
        <p>Precios temporada alta 2022-2023</p>
        <div className="tarifas">
          <img src={promo} className="imgTarifas" alt="Promo primavera" />
          <img src={precios} className="imgTarifas" alt="Tarifas 2023" />
        </div>
      </div>
    </>
  );
}

export default Tarifas;

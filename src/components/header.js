import React from "react";
import logo from "../assets/img/logoAzul.png";
import "../assets/css/header.css";

const header = () => {
  return (
    <header class="contenedor">
      <nav className="nav">
        <img src={logo} id="logo" alt="logo posada" />
        <ul class="lista">
          <li class="active">
            <a href="#inicio" title="inicio" className="a">
              Inicio
            </a>
          </li>
          <li>
            <a href="#casas" title="casas" className="a">
              Casas
            </a>
          </li>
          <li>
            <a href="#servicios" title="Servicios" className="a">
              Servicios
            </a>
          </li>
          <li>
            <a href="#tarifas" title="tarifas" className="a">
              Tarifas
            </a>
          </li>
          <li>
            <a href="#contacto" title="contacto" className="a">
              Contacto
            </a>
          </li>
          {/*<input type="checkbox" id="check" />
          <label for="checkbox" className="checkbtn">
            <i class="fa-solid fa-bars"></i>
  </label>*/}
        </ul>
      </nav>
      <div class="titular">
        <h1>Casas totalmente equipadas</h1>
        <p>
          Ubicadas en zona muy tranquila y a media cuadra de la playa en
          balneario Bello horizonte (Canelones)
        </p>
      </div>
    </header>
  );
};

export default header;

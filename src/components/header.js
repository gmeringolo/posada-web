import React from "react";
import logo from "../assets/img/logoAzul.png";
import "../assets/css/header.css";

const Header = () => {
  return (
    <header>
    <nav>
      <input type="checkbox" id="box" />
      <label for="checkbox" className="checkbtn">
        <i class="fa-solid fa-bars"></i>
      </label>
      <a href="#inicio" className="enlace">
        <img src={logo} class="logo" alt="logo posada" />
      </a>
      <ul>
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
      </ul>
      <section>
        <h1>Casas totalmente equipadas</h1>
        <p>
          Ubicadas en zona muy tranquila y a media cuadra de la playa en
          balneario Bello horizonte (Canelones)
        </p>
      </section>
    </nav>
    </header>
  );
};

export default Header;

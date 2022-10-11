import React from "react";
import logo from "../assets/img/logoAzul.png";
import "../assets/css/header.css";

const header = () => {
  return (
    <header class="contenedor">
      <nav className="nav">
        <img src={logo} id="logo" alt="logo posada" />
        
          <ul class="lista">
            <li class="primer-elemento">
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
        
      </nav>
    </header>
  );
};

export default header;

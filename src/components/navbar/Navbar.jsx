import React, {useState} from "react";
import "./navbar.css";
import logo2 from "./2.png";
import BtnMenu from './BtnMenu';


function Navbar() {  
    /**
     * useState es un Hook que te permite añadir el estado de React a un componente de función 
     * Declaramos una variable de estado llamada clicked y  le asignamos el valor false. React recordara su valor actual entre re-renderizados, y devolvera el valor más reciente a nuestra función.
     * Para acualizar el valor a true creamos una variable llamando al setClick con el valor opuesto a clicked
     */
    const [clicked, setClicked]= useState(false);
    console.log(clicked);

    const handleClick = () =>{
        //cuando esta true lo pasa a false y vice versa
        setClicked(!clicked)
    }
  return (
    <>
      <nav>        
        <a href="#inicio" className="enlace">
          <img src={logo2} className="logo" alt="logo posada" />
        </a>
        <div className={`burguer ${clicked ? 'active': ''} `}>
            <BtnMenu clicked={clicked} handleClick={handleClick}/>
        </div>       
        <ul className={`links ${clicked ? 'active': ''} `}>
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
    </>
  );
}

export default Navbar;

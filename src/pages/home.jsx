import React from "react";
import Header from "../components/header/Header";
import Casas from "../components/casas/Casas";
import Servicios from "../components/servicios/Servicios";
import Tarifas from "../components/tarifas/Tarifas";
import Contacto from "../components/contacto/Contacto";

function home() {
  return (
    <>
      <Header />
      <Casas />
      <Servicios />
      <Tarifas />
      <Contacto />
    </>
  );
}
export default home;

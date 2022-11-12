import React from 'react';
import Header from '../components/header/Header';
import Casas from '../components/casas/Casas';
import Servicios from '../components/servicios/Servicios';

function home() {
    return (
        <>
          <Header />
          <Casas /> 
          <Servicios/> 
        </>
      );    
    }

export default home;

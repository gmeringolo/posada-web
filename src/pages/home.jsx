import React from 'react';
//css
import '../assets/css/home.css'
import Header from '../components/header.js';
//import Banner from '../components/banner.js';

function Home() {
    return (
        <>
        <div className='img'>
          <Header /> 
          <div class="titular">
           <h1>Casas totalmente equipadas</h1>
            <p>Ubicadas en zona muy tranquila y a media cuadra de la playa en balneario Bello horizonte (Canelones)</p>
          </div>
        </div>  

        </>
      );    
    }

export default Home;

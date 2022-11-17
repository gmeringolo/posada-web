import React from "react";
import styles from  "./header.module.css";
import Navbar from "../navbar/Navbar";

function Header() {
  return (
    <>
      <header>
        <Navbar/>
          <div className={styles.section}>
            <h1>Casas totalmente equipadas</h1>
            <p>
              Ubicadas en zona muy tranquila y a media cuadra de la playa en
              balneario Bello horizonte (Canelones)
            </p>
          </div>
      </header>
    </>
  );
}

export default Header;

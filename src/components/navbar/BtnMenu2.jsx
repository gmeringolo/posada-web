import React from "react";

import styled from 'styled-components';


function BtnMenu2(props) {
  return (
    <Burguer>
        <div onClick={props.handleClick} 
        className={`icon nav-icon-5 ${props.clicked ? 'open' : ''}`}>
        </div>
    </Burguer>
  );
}

export default BtnMenu2;
const Burguer = styled.div`
/* nav-icon-5 */
.nav-icon-5{
    content: url("menu.svg");
  }
  `
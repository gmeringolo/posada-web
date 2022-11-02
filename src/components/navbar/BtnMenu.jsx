import React from "react";
import styled from 'styled-components'

function BtnMenu(props) {
  return (
    <Burguer>
    <div onClick={props.handleClick} 
    className={`icon nav-icon-5 ${props.clicked ? 'open' : ''}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
    </Burguer>
  );
}

export default BtnMenu;
const Burguer = styled.div`
/* nav-icon-5 */
.nav-icon-5{
    width: 25px;
    height: 20px;
    margin: 5px 5px;
    position: relative;
    cursor: pointer;
    display: inline-block;
  }
  .nav-icon-5 span{
    background-color:#fff;
    position: absolute;
    border-radius: 2px;
    transition: .3s cubic-bezier(.8, .5, .2, 1.4);
    width:90%;
    height: 3px;
    transition-duration: 500ms
  }
  .nav-icon-5 span:nth-child(1){
    top:0px;
    left: 0px;
  }
  .nav-icon-5 span:nth-child(2){
    top:8px;
    left: 0px;
    opacity:1;
  }
  .nav-icon-5 span:nth-child(3){
    bottom:0px;
    left: 0px;
  }
  .nav-icon-5:not(.open):hover span:nth-child(1){
    transform: rotate(-3deg) scaleY(1.1);
  }
  .nav-icon-5:not(.open):hover span:nth-child(2){
    transform: rotate(3deg) scaleY(1.1);
  }
  .nav-icon-5:not(.open):hover span:nth-child(3){
    transform: rotate(-4deg) scaleY(1.1);
  }
  .nav-icon-5.open span:nth-child(1){
    transform: rotate(45deg);
    top: 13px;
  }
  .nav-icon-5.open span:nth-child(2){
    opacity:0;
  }
  .nav-icon-5.open span:nth-child(3){
    transform: rotate(-45deg);
    top: 13px;
  }
`

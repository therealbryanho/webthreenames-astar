import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { Navbar, Nav, NavItem, NavDropdown, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ConnectionStatus from '../components/ConnectionStatus';
import ConnectButton from './ConnectButton';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import hpb from '../img/logo.png';
import shiden from '../img/shiden-logo.png';

const MenuBar = () => {
  const { account } = useWeb3React();
  
  return (
    <Navbar fixed="top" collapseOnSelect expand="lg" bg="white">
        <Container>
        <Link to="/"><Navbar.Brand><img src={hpb} width="38"/><span>ASTAR NAME SERVICE</span></Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Nav>
            {account ? (
          <Link to="/domains">My Domains</Link>
        ): (
          <div/>
          )}    
          <div className="flex-item justify-end network">
            <a href="https://shiden.webthreenames.com/" target="_blank">
            <img src={shiden} width="25"/>Shiden Network
              </a>
          </div>        
            <ConnectionStatus />
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
  );
}

export default MenuBar;
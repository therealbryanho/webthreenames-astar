import { useWeb3React } from '@web3-react/core';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ConnectionStatus from '../components/ConnectionStatus';
import logo from '../img/logo.png';
import {MdLogout} from 'react-icons/md'

const MenuBar = () => {
  const { account, deactivate } = useWeb3React();

  return (
    <Navbar fixed="top" collapseOnSelect expand="lg" bg="white">
      <Container>
        <Link to="/"><Navbar.Brand><img src={logo} width="40" /> ASTAR NAME SERVICE</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav>
            {account
              &&
              <>
                <Link to="/domains">My Domains</Link>
                <Link to="/market">Market</Link>
                <Link to="/onsale">My Listed</Link>
              </>
            }
            <ConnectionStatus />
            {account
              &&
              <MdLogout className='logout-icon' onClick={() => deactivate()} />
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MenuBar;
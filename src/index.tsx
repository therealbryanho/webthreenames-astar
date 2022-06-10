import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './app.css';
import MintedDomain from './mintedDomain';
import MenuBar from './components/MenuBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function getLibrary(provider: any, connector: any) {
  return new Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
      <div className="App">
        <ScrollToTop />
        <MenuBar/>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="domains" element={<MintedDomain />} />
        </Routes>
        <Footer/>
      </div>
      </BrowserRouter>
    </Web3ReactProvider>
  </StrictMode>,

  document.getElementById('root')
);

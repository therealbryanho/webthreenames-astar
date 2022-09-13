import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { DomainRecords } from "./components/DomainRecords";
import Footer from "./components/Footer";
import { Home } from "./components/Home";
import { ListedOnSale } from "./components/ListedOnSale";
import { Market } from "./components/Market";
import MenuBar from "./components/MenuBar";
import { MyDomains } from "./components/MyDomains";
import { NotFound } from "./components/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import video from './img/gradient-2.mp4';

const App = () => {

  function getLibrary(provider: any, connector: any) {
    return new Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
        <div className="App">
          <div className="body-container">
            <div className="main-container-wrapper">
              <video autoPlay loop muted>
                {/* <source src={video} type="video/mp4" /> */}
              </video>
              <ScrollToTop />
              <MenuBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/domains" element={<MyDomains />} />
                <Route path="/record/:mintName" element={<DomainRecords />} />
                <Route path="/market" element={<Market />} />
                <Route path="/onsale" element={<ListedOnSale />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        <Footer />
        </div>
      </BrowserRouter>
    </Web3ReactProvider>
  );

};

export default App;
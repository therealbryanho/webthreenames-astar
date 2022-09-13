import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import React from 'react'
import ConnectButton from './ConnectButton';
import { Dashboard } from './Dashboard';

export const Home = () => {
  const MetaMask = new InjectedConnector({});
  const { activate, active, account, library, chainId } = useWeb3React();

  return (
    <div className="main-container flex">

      {active
        ?
        <div className=' flex-column'>
          <Dashboard />
        </div>
        :
        <>
          <div className="flex-item">
            <h1>ASTAR Name Service
            </h1>
            <p className="homedesc">Mint your ASTAR Blockchain domain name</p>
            <button
              className="connect-wallet-button"
              onClick={() => {
                activate(MetaMask);
              }}
            >
              Connect Wallet
            </button>
          </div>
          {/* <ConnectButton /> */}
          {/*mints && fetchRecentMints()*/}
        </>
      }
    </div>
  )
}

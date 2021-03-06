/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { createImportSpecifier } from 'typescript';
import hpbLogo from '../img/logo.png';

const MetaMask = new InjectedConnector({});

export default function ConnectionStatus() {
  
  const { activate, active, account, library, chainId } = useWeb3React();
  //const web3React = useWeb3React();
  const switchNetwork = async () => {
    //activate(MetaMask);
    
    if (account) {
      
      try {
        await library.send(
          'wallet_switchEthereumChain',
          [{ chainId: '0x250' }] // Check networks.js for hexadecimal network ids
        );
      } catch (error: any) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await library.send('wallet_addEthereumChain', [
              {
                chainId: '0x250',
                chainName: 'Astar Network',
                rpcUrls: ['https://evm.astar.network/'],
                nativeCurrency: {
                  name: 'Astar Network',
                  symbol: 'ASTR',
                  decimals: 18
                },
                blockExplorerUrls: ['https://blockscout.com/astar/']
              }
            ]);
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      //GoHome();
      if (chainId === 592 && account === undefined) {
        return (
          <div className="flex-item justify-end">
            <img
              alt="Network logo"
              className="logo"
              src={
                //@ts-ignore
                hpbLogo
              }
            />
           {<button
                    className=""
                    onClick={() => {
                      activate(MetaMask);
                    }}
                  >
                    Connect Wallet
                    </button>
          }
          </div>
        );  
        
      } else if (chainId != 592 && account !== undefined) {
        return (
          <div className="flex-item justify-end">
            <button className="" onClick={() => {switchNetwork(); }}>
             Switch to ASTAR Mainnet
              </button>
          </div>
        );
      } else {
        
      }
    }
  };

  const connectWallet = () => {
    if (chainId == 592) {
      return (
        <div className="flex-item justify-end">
          <img
            alt="Network logo"
            className="logo"
            src={
              //@ts-ignore
              hpbLogo
            }
          />
         {account ? (
          <p>
            Wallet: {account.slice(0, 6)}...{account.slice(-4)}{' '}
          </p>
        ) : (
          <button
                  className=""
                  onClick={() => {
                    //activate(MetaMask);
                  }}
                >
                  Connect Wallet
                  </button>
        )}
        </div>
      );  
      
    } else if (chainId !== 592 && account !== undefined) {
      return (
        <div className="flex-item justify-end">
          <button className="" onClick={() => {switchNetwork();  }}>
           Switch to ASTAR Mainnet
            </button>
        </div>
      );
    } else {
      return;
    }
  }
      

  return (
    <>{connectWallet()}</>
  );
}

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from '../utils/contractABI.json';
import { useWeb3React } from '@web3-react/core';
import Avatar from './Avatar';
import { Link } from "react-router-dom";

export type MintedProps = {
  minted: Array<any>;
  loading: boolean;
  balance: number;
  onEdit: (record: any) => void;
};

const CONTRACT_ADDRESS = '0xADE57B7fbD16504761d046435cEb4c110C79aD89';
const tld = '.astar';

export type Record = {
  avatar: string;
  twitterTag: string;
  website: string;
  email: string;
  description: string;
  address: string;
};

export enum RecordType {
  AVATAR = 0,
  TWITTER = 1,
  WEBSITE = 2,
  EMAIL = 3,
  DESCRIPTION = 4
}

export default function RecentlyMinted({ minted, loading, balance, onEdit }: MintedProps) {
  const { activate, active, account, library, chainId } = useWeb3React();
  const [domain, setDomain] = useState('');
  const [mintPrice, setMintPrice] = useState(0);

  const [records, setRecords] = useState<Record | undefined>(undefined);
  const [mints, setMints] = useState<Array<any>>([]);

  var mybalance = balance;

  const switchNetwork = async () => {
    if (account) {
      try {
        // Try to switch to the Mumbai testnet
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
    }
  };

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }

    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert('Domain must be at least 3 characters long');
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    const price = domain.length === 3 ? '250' : domain.length <= 6 ? '120' : '75';
    console.log('Minting domain', domain, 'with price', price);
    try {
      if (active) {
        const signer = library.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

        console.log('Going to pop wallet now to pay gas...');
        const tx = await contract['register'](domain, {
          value: ethers.utils.parseEther(price), gasLimit: 3000000
        });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log('Domain minted! https://blockscout.com/astar/tx/' + tx.hash);

          setTimeout(() => {
            //fetchMints();
          }, 2000);

          setRecords(undefined);
          setDomain('');
        } else {
          alert('Transaction failed! Please try again');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchDomain = async (_domain = domain) => {
    if (!_domain) {
      return;
    }

    if (_domain.length < 3 || _domain.length > 30) return;

    const signer = library.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

    contract['getId'](_domain)
      .then(async () => {
        const res = await contract['getRecords'](_domain);
        const newRecords: Record = {
          avatar: res[0][RecordType.AVATAR],
          twitterTag: res[0][RecordType.TWITTER],
          description: res[0][RecordType.DESCRIPTION],
          email: res[0][RecordType.EMAIL],
          website: res[0][RecordType.WEBSITE],
          address: res[1]
        };

        setRecords(newRecords);
        console.log('NEW RECORDS SET');
      })
      .catch(() => {
        if(_domain.length === 3){
          setMintPrice(250);
        } else if (_domain.length <= 6) {
          setMintPrice(120);
        } else {
          setMintPrice(75);
        }
      });
  };

  const renderInputForm = () => {

    return (
      <div className="form-container">
        {records && (
          <>
            <span id="domain" className="record">
              <input
                type="text"
                value={domain}
                placeholder="domain"
                className="readonly"
                readOnly={true}
                onChange={e => {
                  setRecords(undefined);
                  setMintPrice(0);
                  setDomain(e.target.value);
                }}
              />
              <p className="tld"> {tld} </p>
            </span>
            <span id="addr" className="record">
              <input
                type="text"
                value={records.address}
                placeholder="enter"
                readOnly={true}
                className="readonly"
              />
            </span>
            <span id="desc" className="record">
              <input
                type="text"
                value={records.description}
                placeholder="enter"
                onChange={e => setRecords({ ...records, description: e.target.value })}
                readOnly={account?.toLowerCase() !== records.address.toLowerCase()}
                className={account?.toLowerCase() !== records.address.toLowerCase() ? 'readonly' : ''}
              />
            </span>
            <span id="email" className="record">
              <input
                type="text"
                value={records.email}
                placeholder="enter"
                onChange={e => setRecords({ ...records, email: e.target.value })}
                readOnly={account?.toLowerCase() !== records.address.toLowerCase()}
                className={account?.toLowerCase() !== records.address.toLowerCase() ? 'readonly' : ''}
              />
            </span>
            <span id="website" className="record">
              <input
                type="text"
                value={records.website}
                placeholder="enter"
                onChange={e => setRecords({ ...records, website: e.target.value })}
                readOnly={account?.toLowerCase() !== records.address.toLowerCase()}
                className={account?.toLowerCase() !== records.address.toLowerCase() ? 'readonly' : ''}
              />
            </span>
            <span id="twitter" className="record">
              <input
                type="text"
                value={records.twitterTag}
                placeholder="enter"
                onChange={e => setRecords({ ...records, twitterTag: e.target.value })}
                readOnly={account?.toLowerCase() !== records.address.toLowerCase()}
                className={account?.toLowerCase() !== records.address.toLowerCase() ? 'readonly' : ''}
              />
            </span>
            <span id="avatar" className="record">
              <input
                type="text"
                value={records.avatar}
                placeholder="enter"
                onChange={e => setRecords({ ...records, avatar: e.target.value })}
                readOnly={account?.toLowerCase() !== records.address.toLowerCase()}
                className={account?.toLowerCase() !== records.address.toLowerCase() ? 'readonly' : ''}
              />
            </span>
            <Avatar domain={domain+tld} url={records.avatar} />
            <div className="button-container">
              {records ? (
                <button className="cta-button mint-button" disabled={loading} >
                  Update 3
                </button>
              ) : mintPrice > 0 ? (
                <button className="cta-button mint-button" disabled={loading} onClick={mintDomain}>
                  Mint for {mintPrice} $FTM
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    );
  };
  return (
    <div className="mint-container">
      {/*<div className="background-layer"></div>*/}
      <div className="mint-contents">
        <h2>My Domains</h2>
        {(loading && mybalance > 0) ? (
          <div>
            <p>Loading your minted domains in the smart contract...</p>
          </div>
        ): account === undefined ? (
          <div>
            <p>Connect your wallet again</p>
            <Link to="/">Home</Link>
          </div>
        ): (mybalance===0 && (account !== undefined || loading === false)) ? (
          <div>
            <p>You have not minted any yet</p>
          </div>
        ): (loading === false && mybalance > 0) ? (
          <p>Click on <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/search.png" alt="Edit button" /> to update.</p>
          ) : ( 
            <div>
            <p>You have not minted any yet</p>
          </div>
          )}
        <div className="mint-list">
            {minted.filter(mint => mint.owner == account).map((mint, index) => {
              return (
                <div className="mint-item" key={index}>
                  <div className="mint-row">
                    <a
                      className="link"
                      href={`https://tofunft.com/nft/astar/${CONTRACT_ADDRESS}/${mint.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>
                        {mint.name}
                        {tld}
                      </p>
                    </a>
                    <a href="#"><button className="edit-button" onClick={() => {onEdit(mint.name); renderInputForm();}}>
                      <img
                        className="edit-icon"
                        src="https://img.icons8.com/metro/26/000000/search.png"
                        alt="Edit button"
                      />
                    </button></a>
                  </div>
                  <p> {mint.record} </p>
                </div>
              );
            })}
        </div>
        
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import './app.css';
import { ethers } from 'ethers';
import contractABI from './utils/contractABI.json';

import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import ConnectButton from './components/ConnectButton';
import Avatar from './components/Avatar';

const MetaMask = new InjectedConnector({});

const tld = '.tomb';

// Constants
const CONTRACT_ADDRESS = '0x87BB5534eA05Be4e15594103777C1A68687b6FFf';

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

const App = () => {
  const { activate, active, account, library, chainId } = useWeb3React();
  const [domain, setDomain] = useState('');
  let domainName = "";
  const [mintPrice, setMintPrice] = useState(0);
  const [record, setRecord] = useState(false);

  const [records, setRecords] = useState<Record | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [mints, setMints] = useState<Array<any>>([]);

  useEffect(() => {
    //@ts-ignore
    if(chainId=== 80001){
      fetchRecentMints();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  const fetchRecentMints = async () => {
    try {
      setLoading(true);
      if (active) {
        const signer = library.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

        // Get all the domain names from our contract
        const names = await contract['getAllNames']();

        // For each name, get the record and the address
        //names.slice(-10).reverse().map(async (name: string) => {
        const mintRecords = await Promise.all(
          names.slice(-10).reverse().map(async (name: string) => {
            const mintRecord = await contract['getRecord'](name, 4);
            const owner = await contract['getAddress'](name);
            return {
              id: names.indexOf(name) + 1,
              name: name,
              record: mintRecord,
              owner: owner
            };
          })
        );
        setLoading(false);
        console.log('MINTS FETCHED ', mintRecords);
        setMints(mintRecords);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDomain = async () => {
    if (!records || !domain) {
      return;
    }
    setLoading(true);
    try {
      if (active) {
        const signer = library.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

        const tx = await contract['setRecords'](
          domain,
          records.avatar,
          records.twitterTag, 
          records.website,
          records.email,
          records.description
        );
        await tx.wait();
        console.log('Record set https://blockexplorer.boba.network/tx/' + tx.hash);

        setRecords(undefined);
        setDomain('');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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
    const price = domain.length === 3 ? '0.0055' : domain.length <= 6 ? '0.003' : '0.0015';
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
          console.log('Domain minted! https://blockexplorer.boba.network/tx/' + tx.hash);
          setRecords(undefined);
          //setDomain('');
          searchDomain();
        } else {
          alert('Transaction failed! Please try again');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showDomain = async (_domain = domain) => {
    setDomain(domainName);
    _domain = domainName;
    
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
        
      });
  };

  const searchDomain = async (_domain = domain) => {
    if (!_domain) {
       _domain = domainName;
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
          setMintPrice(0.0055);
        } else if (_domain.length <= 6) {
          setMintPrice(0.003);
        } else {
          setMintPrice(0.0015);
        }
      });
  };

  const renderInputForm = () => {
    //@ts-ignore
    //if( networks[chainId?.toString(16)]?.includes('HPB') ){
    if (chainId !== 80001) {
      return (
        <div className="connect-wallet-container">
          <h2>Connected to wrong network</h2>
          {/* This button will call our switch network function */}
          {/*<button className="cta-button mint-button" onClick={switchNetwork }>
          Please switch to HPB Mainnet btn
          </button>*/}
        </div>
      );
    }

    return (
      <div className="form-container">
      <div className="first-row">
        <span id="domain" className="record">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            onChange={e => {
              setRecords(undefined);
              setMintPrice(0);
              setDomain(e.target.value);
            }}
          />
          <p className="tld"> {tld} </p>
          </span>
        </div>
        {records && (
          <>
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
          </>
        )}
        <div className="button-container">
          <button
            className="cta-button mint-button"
            onClick={() => {
              searchDomain();
            }}
          >
            Search
          </button>
          {(records && records.address === account) ? (
            <button className="cta-button mint-button" disabled={loading} onClick={updateDomain}>
              Update
            </button>
          ) : mintPrice > 0 ? (
            <button className="cta-button mint-button" onClick={mintDomain}>
              Mint for {mintPrice} $ETH
            </button>
          ) : null}
        </div>
        {loading ? (
          <p>Loading the last 10 minted domains in the smart contract...</p>
        ): (
          <p>Last 10 Minted Domains</p>
          )}
        <div className="mint-list">
            {mints.map((mint, index) => {
              return (
                <div className="mint-item" key={index}>
                  <div className="mint-row">
                    <a
                      className="link"
                      href={`https://tofunft.com/nft/tomb/${CONTRACT_ADDRESS}/${mint.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>
                        {mint.name}
                        {tld}
                      </p>
                    </a>
                    <a href="#"><button className="edit-button" onClick={() => {domainName = mint.name; showDomain();}} >
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
    );
  };

  return (
      <div className="body-container">
        <div className="main-container-wrapper">
          <div className="main-container flex">
            
            {active ? renderInputForm() :
              <>
                <div className="flex-item left">
                  <h1>Tomb Name<br/>Service
                  <button
                  className="cta-button connect-wallet-button"
                  onClick={() => {
                    activate(MetaMask);
                  }}
                >
                  Connect Wallet
                  </button>
                  </h1>
                </div>
                <ConnectButton/>
                {/*mints && fetchRecentMints()*/}
                </>
              }
          </div>
        </div>
      </div>
  );


};

export default App;

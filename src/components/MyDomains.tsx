import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { BiSearchAlt } from 'react-icons/bi'
import loadingGif from '../img/loading9.gif'
import Modal from 'react-bootstrap/Modal';
import { AiOutlineClose } from 'react-icons/ai'
import { FaEthereum } from 'react-icons/fa'
import { toWei } from '../utils/unitConvert';
import { CONTRACT_ADDRESS, marketContract, marketContractAddress, myContract, myNetworkId, tld, myChainId } from '../utils/constants';
import { Record } from '../utils/types';
import { InjectedConnector } from '@web3-react/injected-connector';



export const MyDomains = () => {

  const { account, library, chainId } = useWeb3React();

  const [loading, setLoading] = useState(true);
  const [myMints, setMyMints] = useState<any>([]);

  const navigate = useNavigate();
  const [sellingDomain, setSellingDomain] = useState<{ id: string, name: string, record: string, owner: string }>({ id: '', name: '', record: '', owner: '' });
  const [sellingPrice, setSellingPrice] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [makingTransaction, setMakingTransaction] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('Confirming the transaction');

  //modal
  const [show, setShow] = useState(false);
  const closeModal = () => { setShow(false); setSellingPrice('') };
  const showModal = () => { setShow(true); checkIfApproved() };


  useEffect(() => {
    checkIfApproved();
    loadMyMints();
  }, [account,chainId])



  const loadMyMints = async () => {
    if (account) {
      setLoading(true);
      const signer = library.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

      const myBalance = await contract['balanceOf'](account);

      if (myBalance !== 0) {
        // Get all the domain names from our contract
        const names = await contract['walletOfOwner'](account);

        const mintRecords: Array<any> = await Promise.all(
          names.map(async (tokenId: string) => {
            const name = await contract['names'](tokenId);

            //setting records in one object
            const mintRecord = await contract['getRecords'](name);
            const mergedRecord: any = Object.assign([], mintRecord[0]);
            mergedRecord.push(mintRecord[1])
            const convertedRecords: Record = Object.assign({}, mergedRecord);
            const newKeys = { 0: 'avatar', 1: 'twitterTag', 2: 'website', 3: 'email', 4: 'description', 5: 'address' }
            const renamedRecord = renameKeys(convertedRecords, newKeys);

            const owner = await contract['getAddress'](name);
            return {
              id: tokenId,
              name: name.toLowerCase(),
              record: renamedRecord,
              owner: owner
            };
          })
        );

        if (mintRecords) {
          console.log(mintRecords);
          setMyMints(mintRecords);
          setLoading(false);
        }
      }

    }
  }



  const checkIfApproved = async () => {
    const signer = library.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

    //get the record for the {mintName}
    const result = await contract['isApprovedForAll'](account, marketContractAddress);

    if (result) {
      setIsApproved(true);
      console.log('approved');
    } else {
      setIsApproved(false);
      console.log('Not approved');
    }
  }

  const getApproval = async () => {
    setMakingTransaction(true);

    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

      console.log('Going to pop wallet now to pay gas...');
      setTransactionStatus('Confirming the transaction');
      const tx = await contract['setApprovalForAll'](
        marketContractAddress,
        true,
        {
          from: account,
          gasLimit: 3000000
        }
      );

      // Wait for the transaction to be mined
      console.log('waiting for transaction to be mined...')
      setTransactionStatus('Mining transaction');
      const receipt = await tx.wait();

      console.log(receipt)
      if (receipt.status === 1) {
        checkIfApproved();
        setMakingTransaction(false);
        setTransactionStatus('');
      } else {
        alert('Failed to get approval');
        setMakingTransaction(false);
        setTransactionStatus('');
      }

    } catch {
      alert('Failed to get approval');
      setMakingTransaction(false);
      setTransactionStatus('');
    }
  }


  const continueSale = (e: any) => {
    const mint = JSON.parse(e.target.value);
    setSellingDomain(mint);
    showModal();
  }

  const confirmSale = async (e: any) => {
    e.preventDefault();

    setMakingTransaction(true);

    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(marketContractAddress, marketContract.output.abi, signer);

      console.log('Going to pop wallet now to pay gas...');
      setTransactionStatus('Confirming the transaction');
      const tx = await contract['createMarketItem'](
        CONTRACT_ADDRESS,
        sellingDomain.id,
        toWei(sellingPrice),
        {
          from: account,
          gasLimit: 3000000
        }
      );

      // Wait for the transaction to be mined
      console.log('waiting for transaction to be mined...')
      setTransactionStatus('Mining transaction');
      const receipt = await tx.wait();

      console.log(receipt)
      if (receipt.status === 1) {
        closeModal();
        loadMyMints();
        setMakingTransaction(false);
        setTransactionStatus('');
      } else {
        alert('Failed to list domain');
        setMakingTransaction(false);
        setTransactionStatus('');
      }

    } catch {
      alert('Failed to list domain');
      setMakingTransaction(false);
      setTransactionStatus('');
    }
  }



  //function to rename object key {a:1} => {x:1} 
  function renameKeys(obj: any, newKeys: any) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }




  return (
    <>
      {makingTransaction
        &&
        <div className='loading-overlay'>
        </div>
      }
      <div className="main-container flex flex-column">
        {!account
          ? <h2>Wallet disconnected.....Connect your wallet to access this page.</h2>
          : <>
            {
              (chainId != myChainId)
                ?
                <>
                  <h2>Connected to wrong network</h2>
                </>

                :
                <>
                  <h2>My Domains</h2>
                  {loading
                    ? <p><img className='loading-gif' src={loadingGif} alt='loading spinner' /></p>
                    :
                    <div className="myMint-container">
                      {myMints.length > 0
                        ?
                        <>
                          {myMints.map((mint: any, key: any) => (
                            <div key={key} className="myMint">
                              <Avatar domain={`${mint.name.toLowerCase()}${tld}`} price='' url={mint.record.avatar} />
                              <div className='myMint-footer'>
                                <button className='mint-button' value={JSON.stringify(mint)}
                                  onClick={(e) => {
                                    continueSale(e)
                                  }}>List for Sale</button>

                                {/* <div>&#10003; Listed for sale</div> */}
                                <button className="edit-button"
                                  onClick={() => { navigate(`/record/${mint.name}`) }}>
                                  <BiSearchAlt className="edit-icon" />
                                </button>
                              </div>
                            </div>

                          ))}
                        </>
                        : <p>No domains available.</p>
                      }


                      <Modal show={show} onHide={closeModal} centered size="lg">
                        <Modal.Header >
                          <Modal.Title className='h-100 w-100 d-flex justify-content-between align-center'>
                            Domain Listing
                            <AiOutlineClose className='' style={{ cursor: 'pointer' }} role='button' onClick={closeModal} />
                          </Modal.Title>
                        </Modal.Header>
                        {isApproved
                          ?
                          <form onSubmit={confirmSale}>
                            <Modal.Body>
                              <div className='modal-body'>
                                <p>Selected Domain: </p>
                                <h3>{sellingDomain.name.toLocaleLowerCase()}{tld}</h3>
                                <label htmlFor="price-input">Set Price -</label>
                                <div className="input-group mb-3">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon3"><FaEthereum /></span>

                                  </div>
                                  <input required type="number" step=".0001" value={sellingPrice} onChange={e => { setSellingPrice(e.target.value) }} className="form-control" id="price-input" aria-describedby="basic-addon3" />
                                </div>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              {/* <button className='mint-button close-button' onClick={closeModal}>
                                Close
                              </button> */}
                              {makingTransaction
                                ? <p className='mx-4'>{transactionStatus}<img className='loading-gif' src={loadingGif} alt='loading spinner' /></p>
                                :
                                <button type='submit' className='mint-button'>
                                  Confirm Listing
                                </button>
                              }
                            </Modal.Footer>
                          </form>

                          :
                          <>
                            < Modal.Body >
                              <div className='modal-body'>
                                <h3>Approval Pending</h3>
                                <p>You need to get a quick approval for your wallet before you start listing your domain for sale.</p>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              {/* <button className='mint-button close-button' onClick={closeModal}>
                                Close
                              </button> */}
                              {makingTransaction
                                ? <p className='mx-4'>{transactionStatus}<img className='loading-gif' src={loadingGif} alt='loading spinner' /></p>
                                :
                                <button className='mint-button' onClick={() => { getApproval() }}>
                                  Get Approval
                                </button>
                              }
                            </Modal.Footer>
                          </>
                        }

                      </Modal >
                    </div>
                  }
                </>
            }
          </>
        }
      </div>
    </>
  )
}

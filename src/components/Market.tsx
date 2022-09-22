import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { BiSearchAlt } from 'react-icons/bi'
import loadingGif from '../img/loading9.gif'
import Modal from 'react-bootstrap/Modal';
import { AiOutlineClose } from 'react-icons/ai'
import { CONTRACT_ADDRESS, marketContract, marketContractAddress, myChainId, myContract, tld, currency } from '../utils/constants';

export const Market = () => {
  const { account, library, chainId } = useWeb3React();

  const [allListed, setAllListed] = useState([]);
  const [domainData, setDomainData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [makingTransaction, setMakingTransaction] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('Confirming the transaction');
  const [selectedDomain, setSelectedDomain] = useState<any>({});


  //modal
  const [show, setShow] = useState(false);
  const closeModal = () => { setShow(false); setSelectedDomain('') };
  const showModal = () => { setShow(true) };


  useEffect(() => {
    loadAllDomainsOnSale();
  }, [account, chainId])

  const loadAllDomainsOnSale = async () => {
    if (account) {
      setLoading(true);
      const signer = library.getSigner();
      const contract = new ethers.Contract(marketContractAddress, marketContract.output.abi, signer);

      //fetching all items from market
      const result = await contract['fetchMarketItems']();
      if (result) {
        //removing the null objects that had been sold
        const trimmed: any = [];
        result.map((mint: any) => {
          if (mint[0]._hex !== '0x00') {
            trimmed.push(mint)
          }
        })
        console.log('allDomains on sale- ', trimmed)

        //fetching items that i have listed on sale
        const myListed = await loadMyListedDomains();
        console.log('myListed Domains- ', myListed)


        //filtering the domains that o have listed from all the domains available on market
        const filtered: any = trimmed.filter((domain: any) => {
          return !myListed.find((mint: any) => {
            return mint.tokenId._hex === domain.tokenId._hex
          })
        })

        console.log('filtered', filtered);
        setAllListed(filtered);


        // we have domain id but not the domain name, below function is to get the domain names
        const ids: any = [];
        filtered.map((i: any) => ids.push(i.tokenId))
        const data: any = await getDomainDataFromIds(ids);
        if (data) {
          console.log(data)
          setDomainData(data);
        }

        setLoading(false);
      }
    }
  }


  // to get list of domains that i have listed on sale
  const loadMyListedDomains = async () => {
    if (account) {
      const signer = library.getSigner();
      const contract = new ethers.Contract(marketContractAddress, marketContract.output.abi, signer);

      const result = await contract['fetchContractMarketItemsBySeller'](CONTRACT_ADDRESS, account);
      if (result) {
        const trimmed: any = []; //to store the listed domains and removing any null data
        result.map((mint: any) => {
          if (mint[0]._hex !== '0x00') {
            trimmed.push(mint)
          }
        })
        return trimmed;

      }
    }
  }


  //returns an array of domain data corresponding to domain ids provided
  const getDomainDataFromIds = async (idList: any[]) => {

    const signer = library.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

    const mintRecords: Array<any> = await Promise.all(
      idList.map(async (tokenId: string) => {
        const name = await contract['names'](tokenId);
        const mintRecord = await contract['getRecords'](name);
        // const owner = await contract.methods.getAddress(name).call();
        return {
          id: tokenId,
          name: name.toLowerCase(),
          record: mintRecord
        };
      })
    );

    return mintRecords;
  }




  const buyDomain = async () => {
    console.log('buying domain - ', selectedDomain);
    setMakingTransaction(true);

    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(marketContractAddress, marketContract.output.abi, signer);

      console.log('Going to pop wallet now to pay gas...');
      setTransactionStatus('Confirming the transaction');
      const tx = await contract['createMarketSale'](
        CONTRACT_ADDRESS,
        selectedDomain[0].itemId,
        {
          from: account,
          value: selectedDomain[0].price,
          gasLimit: 3000000
        }
      );

      // Wait for the transaction to be mined
      console.log('waiting for transaction to be mined...')
      setTransactionStatus('Mining transaction');
      const receipt = await tx.wait();

      console.log(receipt)
      if (receipt.status === 1) {
        closeModal(); //close modal
        loadAllDomainsOnSale(); //reload the domains on market
        setMakingTransaction(false);
        setTransactionStatus('');
      } else {
        alert('Failed to buy domain');
        console.log('Transaction Failed');
        setMakingTransaction(false);
        setTransactionStatus('');
      }

    } catch {
      alert('Failed to buy domain');
      console.log('Transaction Failed');
      setMakingTransaction(false);
      setTransactionStatus('');
    }

  }



  return (
    <>
      {makingTransaction
        &&
        <div className='loading-overlay'>
        </div>
      }
      <div className='main-container flex flex-column'>
        {!account
          ? <h2>Wallet disconnected.....Connect your wallet to access this page.</h2>
          :
          <>
            {chainId !== myChainId
              ? <h2>Connected to wrong network</h2>
              :
              <>
                <h2>Market</h2>
                {loading
                  ? <p><img className='loading-gif' src={loadingGif} alt='loading spinner' /></p>
                  :
                  <div className="myMint-container">
                    <>
                      {allListed.length > 0

                        ?
                        <>
                          {allListed.map((mint: any, key) => (
                            <div key={key} className="myMint">
                              <Avatar domain={`${domainData[key].name.toLowerCase()}${tld}`} url={domainData[key].record[0][0]} price={ethers.utils.formatEther(mint[5])} />
                              <div className='myMint-footer'>
                                <button className='mint-button' onClick={() => { setSelectedDomain([mint, domainData[key]]); showModal() }}>Buy</button>
                                {/* <div>&#10003; Listed for sale</div> */}
                                <button className="edit-button"
                                  onClick={() => { navigate(`/record/${domainData[key].name}`) }}>
                                  <BiSearchAlt className="edit-icon" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </>

                        :
                        <p>No domains available in market.</p>
                      }
                    </>


                    <Modal show={show} onHide={closeModal} centered size="lg">
                      <Modal.Header >
                        <Modal.Title className='h-100 w-100 d-flex justify-content-between align-center'>
                          Buying Domain
                          <AiOutlineClose className='' style={{ cursor: 'pointer' }} role='button' onClick={closeModal} />
                        </Modal.Title>
                      </Modal.Header>
                      < Modal.Body >
                        <div className='modal-body'>
                          <p>Please confirm if you want to buy the selected domain</p>
                          <p>Selected Domain - <b>{selectedDomain.length > 0 && selectedDomain[1].name}{tld}</b></p>
                          <p>Price - <b>{selectedDomain.length > 0 && ethers.utils.formatEther(selectedDomain[0].price)} {currency}</b></p>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        {/* <button disabled={makingTransaction} className='mint-button close-button' onClick={() => { closeModal() }}>
                          Close
                        </button> */}
                        {makingTransaction
                          ? <p className='mx-4'>{transactionStatus}<img className='loading-gif' src={loadingGif} alt='loading spinner' /></p>
                          :
                          <button className='mint-button ' onClick={() => { buyDomain() }}>
                            Confirm Purchase
                          </button>
                        }
                      </Modal.Footer>
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

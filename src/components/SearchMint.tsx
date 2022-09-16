import { useState } from 'react';
import { CONTRACT_ADDRESS, currency, myContract, priceForLengthEqual3, priceForLengthLessThan6, priceForLengthMoreThan6, tld } from '../utils/constants';
import loadingGif from '../img/loading9.gif';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

export const SearchMint = () => {
  const { account, library } = useWeb3React();
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [mintPrice, setMintPrice] = useState(0);
  const [makingTransaction, setMakingTransaction] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('');

  const navigate = useNavigate();

  const searchDomain = async () => {
    setError('');

    //to check if domain is empty
    if (!domain) {
      setError("This field can't be empty");
      return
    }

    //to check if length of domain in correct
    if (domain.length < 3 || domain.length > 30) {
      setError("Domain name must be between 3 and 30 character");
      return
    };


    //check if record for the searched domain already exists
    const signer = library.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

    //get the record for the {mintName}
    await contract['getRecords'](domain.toLocaleLowerCase())
      .then((res: any) => {
        if (res) {
          console.log('Domain taken redirecting to domain record...')
          navigate(`record/${domain}`);
        }
      })
      .catch((err: any) => {
        console.log('Domain available...')
        
        //set price
        if (domain.length === 3) {
          setMintPrice(priceForLengthEqual3);
        } else if (domain.length <= 6) {
          setMintPrice(priceForLengthLessThan6);
        } else {
          setMintPrice(priceForLengthMoreThan6);
        }
      })

  }

  const mintDomain = async () => {
    setError('');
    setMakingTransaction(true);

    console.log('Starting minting domain');
    if (account) {
      try {
        const signer = library.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

        console.log('Going to pop wallet now to pay gas...');
        setTransactionStatus('Confirming the transaction');
        const tx = await contract['register'](
          domain.toLowerCase(),
          {
            value: ethers.utils.parseEther(mintPrice.toString()),
            gasLimit: 3000000
          }
        );

        // Wait for the transaction to be mined
        console.log('waiting for transaction to be mined...')
        setTransactionStatus('Mining transaction');
        const receipt = await tx.wait();

        console.log(receipt)
        if (receipt.status === 1) {
          console.log('Minted Successfully');
          setTransactionStatus('');
          navigate(`/record/${domain}`)
          setMakingTransaction(false);
        } else {
          alert('Update Failed');
          setError('Failed to mint domain. Please try again later')
          setTransactionStatus('');
          setMakingTransaction(false);
        }

      } catch {
        alert('Update Failed');
        setTransactionStatus('');
        setMakingTransaction(false);
      }
    } else {
      alert("Can't mint domain right now")
    }
  }

  return (
    <div className="search-container">
      <h1>Find Domains</h1>
      <p className='text-danger'>{error}</p>
      <div className="first-row">
        <span id="domain" className="record">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            readOnly={makingTransaction}
            onChange={e => {
              setDomain(e.target.value.toLowerCase());
              setMintPrice(0);
              setError('');
            }}
          />
          <p className="tld"> {tld} </p>
        </span>
      </div>

      <div className="button-container">
        <button disabled={makingTransaction} className="cta-button mint-button"
          onClick={() => { searchDomain() }}>Search</button>

        {mintPrice > 0
          &&
          <>
            {makingTransaction
              ? <img className='loading-gif search-loader' src={loadingGif} alt='loading spinner' />
              :
              <button className="mint-button" onClick={() => { mintDomain() }}>
                Mint for {mintPrice} {currency}
              </button>
            }
          </>
        }

      </div>
    </div>
  )
}

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {BiSearchAlt} from 'react-icons/bi'
import loadingGif from '../img/loading9.gif'
import { CONTRACT_ADDRESS, mintScanUrlPrefix, myContract, tld } from '../utils/constants';

export const RecentMints = () => {

  const { library } = useWeb3React();
  const navigate = useNavigate();

  const [mints, setMints] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadRecentMints();
  }, [])



  const loadRecentMints = async () => {
    setLoading(true);

    const signer = library.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

    // Get all the domain names from our contract
    const names = await contract['getAllNames']();


    // For each name, get the record and the address
    const fetchedMints: any = await Promise.all(
      names.slice(-10).reverse().map(async (name: string) => {
        const mintRecord = await contract['getRecords'](name);
        const owner = await contract['getAddress'](name);
        return {
          id: names.indexOf(name) + 1,
          name: name,
          record: mintRecord,
          owner: owner
        };
      })
    );

    if (fetchedMints) {
      setMints(fetchedMints);
      setLoading(false)
    } else {
      alert('error in fetch');
      setLoading(false)
    }
  }



  return (
    <>
      <p>Last 10 Minted Domains</p>
      <div className="mint-list">
        {loading
          ?
          <p><img className='loading-gif' src={loadingGif} alt='loading spinner' /></p>
          :
          <>
            {mints.map((mint: any, index) => {
              return (
                <div className="mint-item" key={index}>
                  <div className="mint-row">
                    <a
                      className="link"
                      href={`${mintScanUrlPrefix}/${mint.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="underlined">
                        {mint.name}
                        {tld}
                      </p>
                    </a>
                    <button className="edit-button"
                      onClick={() => {
                        navigate(`/record/${mint.name}`)
                      }} >
                      <BiSearchAlt className="edit-icon edit-icon-dark"/>
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        }
      </div>
    </>
  )
}

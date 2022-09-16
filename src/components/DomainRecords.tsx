import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CONTRACT_ADDRESS, myChainId, myContract, tld } from '../utils/constants';
import Avatar from './Avatar';
import loadingGif from '../img/loading9.gif'
import { Record } from '../utils/types';

export const DomainRecords = () => {
  const { account, library, chainId } = useWeb3React();
  const { mintName } = useParams();
  const [records, setRecords] = useState<Record | any>({});
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [makingTransaction, setMakingTransaction] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('');

  useEffect(() => {
    loadRecord();
  }, [account, chainId])

  const loadRecord = async () => {
    if (account) {
      setLoading(true);

      const signer = library.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

      //get the record for the {mintName}
      await contract['getRecords'](mintName)
        .then((res: any) => {
          console.log(res[0]);
          if (res) {
            const mergedRecord: any = Object.assign([], res[0]);
            mergedRecord.push(res[1])
            const convertedRecords: Record = Object.assign({}, mergedRecord);
            const newKeys = { 0: 'avatar', 1: 'twitterTag', 2: 'website', 3: 'email', 4: 'description', 5: 'address' }
            const renamedRecord = renameKeys(convertedRecords, newKeys);
            // var convertedRecords:Record;
            console.log(renamedRecord)

            //to check if connected account is the owner of the domain
            if (account === renamedRecord.address) {
              console.log('Owner')
              setIsOwner(true);
            } else {
              console.log('Viewer')
              setIsOwner(false);
            }

            setRecords(renamedRecord);
            setLoading(false)
          } else {
            alert('error in fetch');
            setLoading(false)
          }
        })
        .catch((err: any) => {
          setLoading(false);
        })

    }
  }

  function renameKeys(obj: any, newKeys: any) {
    console.log('assigning keys to record object...')
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  const updateHandler = async (e: any) => {
    e.preventDefault();
    setMakingTransaction(true);
    setTransactionStatus('Updating domain record');

    console.log('Starting the domain record update...')

    if (account === records?.address) {
      try {
        const signer = library.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, myContract.abi, signer);

        console.log('Going to pop wallet now to pay gas...');
        setTransactionStatus('Confirming the transaction');
        const tx = await contract['setRecords'](
          mintName,
          records?.avatar,
          records?.twitterTag,
          records?.website,
          records?.email,
          records?.description,
          {
            from: records?.address,
            gasLimit: 3000000
          }
        );

        // Wait for the transaction to be mined
        console.log('waiting for transaction to be mined...')
        setTransactionStatus('Mining transaction');
        const receipt = await tx.wait();

        console.log(receipt)
        if (receipt.status === 1) {
          console.log('Update Success');
          setTransactionStatus('Reloading your domain record');
          loadRecord();
          setMakingTransaction(false);
          setTransactionStatus('');
        } else {
          alert('Update Failed');
          setMakingTransaction(false);
          setTransactionStatus('');
        }

      } catch {
        alert('Update Failed');
        setMakingTransaction(false);
        setTransactionStatus('');
      }
    } else {
      alert("Can't update other users domain records")
    }
  }

  return (
    <div className="main-container flex flex-column">
      {!account
        ? <h2>Wallet disconnected.....Connect your wallet to access this page.</h2>
        :
        <>
          {chainId !== myChainId
            ? <h2>Connected to wrong network</h2>
            :
            <>
              {loading
                ? <p><img className='loading-gif' src={loadingGif} alt='loading spinner' /></p>
                : <>
                  {records.avatar !== undefined
                    ?
                    <>
                      <div className='form-container'>
                        <div>
                          <h2 className='record-heading'>{isOwner ? 'My Domain' : 'Viewing Record'} - {mintName + tld}</h2>
                          <form onSubmit={updateHandler}>
                            <span id="domain" className="record">
                              <input
                                type="text"
                                value={mintName?.toLowerCase()}
                                placeholder="domain"
                                className="readonly"
                                readOnly={true}
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
                                readOnly={!isOwner}
                                className={!isOwner ? 'readonly' : ''}
                              />
                            </span>
                            <span id="email" className="record">
                              <input
                                type="email"
                                value={records.email}
                                placeholder="enter"
                                onChange={e => setRecords({ ...records, email: e.target.value })}
                                readOnly={!isOwner}
                                className={!isOwner ? 'readonly' : ''}
                              />
                            </span>
                            <span id="website" className="record">
                              <input
                                type="url"
                                value={records.website}
                                placeholder="enter"
                                onChange={e => setRecords({ ...records, website: e.target.value })}
                                readOnly={!isOwner}
                                className={!isOwner ? 'readonly' : ''}
                              />
                            </span>
                            <span id="twitter" className="record">
                              <input
                                type="text"
                                value={records.twitterTag}
                                placeholder="enter"
                                onChange={e => setRecords({ ...records, twitterTag: e.target.value })}
                                readOnly={!isOwner}
                                className={!isOwner ? 'readonly' : ''}
                              />
                            </span>
                            <span id="avatar" className="record mb-5">
                              <input
                                type="url"
                                value={records.avatar}
                                placeholder="enter"
                                onChange={e => setRecords({ ...records, avatar: e.target.value })}
                                readOnly={!isOwner}
                                className={!isOwner ? 'readonly' : ''}
                              />
                            </span>
                            {isOwner
                              &&
                              <>
                                {makingTransaction
                                  ? <p>{transactionStatus}<img className='loading-gif' src={loadingGif} alt='loading spinner' /></p>
                                  :
                                  <button type='submit' className="mint-button" disabled={loading} >
                                    Update
                                  </button>
                                }
                              </>
                            }


                          </form>
                        </div>
                        <div className="record-avatar" >
                          <Avatar domain={mintName?.toLocaleLowerCase() + tld} price='' url={records.avatar} />
                        </div>
                      </div>
                    </>
                    : <>
                      <p>No records found...!</p>
                    </>
                  }
                </>
              }
            </>
          }
        </>

      }
    </div >
  )
}

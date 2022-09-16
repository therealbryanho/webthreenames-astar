import { useWeb3React } from '@web3-react/core'
import { myChainId } from '../utils/constants'
import { RecentMints } from './RecentMints'
import { SearchMint } from './SearchMint'

export const Dashboard = () => {
  const { account, chainId } = useWeb3React();
  return (
    <>
      {!account
        ? <h2>Wallet disconnected.....Connect your wallet to access this page.</h2>
        : <>
          {chainId !== myChainId
            ? <h2>Connected to wrong network</h2>
            :
            <>
              <SearchMint />
              <RecentMints />
            </>
          }
        </>

      }
    </>
  )
}
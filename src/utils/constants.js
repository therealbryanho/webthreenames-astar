import contractABI from './contractABI.json';
import marketContractABI from './marketContractABI.json';

export const tld = '.astar';
export const currency = '$ETH'

export const priceForLengthEqual3 = 0.0055;
export const priceForLengthLessThan6 = 0.003;
export const priceForLengthMoreThan6 = 0.0015;

export const CONTRACT_ADDRESS = '0x87BB5534eA05Be4e15594103777C1A68687b6FFf'; //for test - mumbai address
// export const CONTRACT_ADDRESS = '0xADE57B7fbD16504761d046435cEb4c110C79aD89'; //astar address
export const myContract = contractABI;

export const marketContractAddress = '0xD5212C78ef3969c04632a71BC6c6116A9c82Be9B';
export const marketContract = marketContractABI;

//check network.js for this id for different networks
export const myNetworkId = '13881'; //for test - mumbai 
// export const myNetworkId = '0x250'; //astar networkId

export const myChainId = 80001 //for test - mumbai
// export const myChainId = 592 //astar chainId


export const networkConnectionObject =
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









import Web3 from 'web3'
import Big from 'big.js';
import UniswapV2Pair from './abi/IUniswapV2Pair.json' assert { type: 'json' };

const RPC_URL = 'https://mainnet.infura.io/v3/7e27b68af4184953918a38b5809edb9b'
const RPC_WS = 'wss://mainnet.infura.io/ws/v3/7e27b68af4184953918a38b5809edb9b'

const web3Http = new Web3(RPC_URL)
const web3Ws = new Web3(RPC_WS)

// define address of Pair contract
const PAIR_ADDR = "0xb20bd5d04be54f870d5c0d3ca85d82b34b836405";
const PAIR_NAME = "ETH/DAI";

// create web3 contract object
const PairContractHTTP = new web3Http.eth.Contract(
    UniswapV2Pair.abi,
    PAIR_ADDR
)

// function to get reserves
const getReserves = async (ContractObj) => {
    // call getReserves function of Pair contract
    const _reserves = await ContractObj.methods.getReserves().call();

    // return data in Big Number
    return [Big(_reserves.reserve0), Big(_reserves.reserve1)];
}


const mainHTTP = async () => {

    // get reserves
    const [amtToken0, amtToken1] = await getReserves(PairContractHTTP);

    // calculate price and print
    console.log(
        `Price ${PAIR_NAME} : ${amtToken0.div(amtToken1).toString()}`
    );
    console.log(
        `Price ${PAIR_NAME} : ${amtToken1.div(amtToken0).toString()}`
    );

};

mainHTTP()

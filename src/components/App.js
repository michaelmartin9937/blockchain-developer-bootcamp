import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config.json';


import { 
  loadProvider, 
  loadNetwork, 
  loadAccount, 
  loadTokens,
  loadExchange,
  subscribeToEvents,
  loadAllOrders
} from '../store/interactions';

import Navbar from './Navbar'
import Markets from './Markets'
import Balance from './Balance'
import Order from './Order'
import PriceChart from './PriceChart'
import Transactions from './Transactions'
import Trades from './Trades'
import OrderBook from './OrderBook'
import Alert from './Alert'


function App() {
  const dispatch = useDispatch()

  // this function connects to metamask
  const loadBlockChainData = async () => {
    // Connect Ethers to blockchain
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // dispatch({ type: 'PROVIDER_LOADED', connection: provider })
    // const provider = loadProvider(dispatch)
    // const network = await provider.getNetwork()
    // console.log(network.chainId)
    // const { chainId } = await provider.getNetwork()
    // const { chainId } = await loadNetwork(provider, dispatch)
    // const chainId = await loadNetwork(provider, dispatch)
    
    // Connect Ethers to blockchain
    const provider = loadProvider(dispatch)

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
      // window is a global javascript varialbe
      // location is the url that you're currently at
    })

    // Token Smart Contract
    // const token = new ethers.Contract(config[chainId].DApp.address, TOKEN_ABI, provider)
    // console.log(token.address)
    // await loadTokens(provider, [config[chainId].DApp.address, config[chainId].mETH.address], dispatch)
    // provider.getCode("0x5FbDB2315678afecb367f032d93F642f64180aa3")
    // const symbol = await token.symbol()
    // console.log(symbol)

    // Fetch current account & balance from Metamask when changed
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    // await loadAccount(provider, dispatch)

    // Load token smart contracts
    const DApp = config[chainId].DApp
    console.log(DApp)
    const mETH = config[chainId].mETH
    console.log(mETH)
    await loadTokens(provider, [DApp.address, mETH.address], dispatch)

    // Load exchange smart contract
    const exchangeConfig = config[chainId].exchange
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch)

    // Fetch all orders: open, filled, cancelled
    loadAllOrders(provider, exchange, dispatch)

    // Listen to events
    subscribeToEvents(exchange, dispatch)
  }

  useEffect(() => {
    loadBlockChainData()
  })

  return (
    <div>

      <Navbar />


      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          <Markets />

          <Balance />

          <Order />

        </section>
        <section className='exchange__section--right grid'>

          <PriceChart />

          <Transactions />

          <Trades />

          <OrderBook />

        </section>
      </main>

      <Alert />

    </div>
  );
}


export default App;


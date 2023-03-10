import { useState , useEffect} from 'react'
import {ethers} from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'


import {
  nftaddress,nftmarketaddress
} from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'


export default function CreatorDashboard(){
  const [nfts,setNfts] = useState([])
  const [sold,setSold] = useState([])
  const [loadingState,setLoadingState] = useState('not-loaded')

  useEffect(()=>{
    loadNFTs()
  })

  async function loadNFTs(){
    try{
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const marketContract = new ethers.Contract(nftmarketaddress,Market.abi,signer)
      const tokenContract = new ethers.Contract(nftaddress,NFT.abi,provider)
      const data = marketContract.fetchMyNFTs()

      const items = await Promise.all(data.map(async (i)=>{
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)

        let price = ethers.utils.formatUnits(i.price.toString(),'ether')
        let item = {
          price,
          tokenId : i.tokenId.toNumber(),
          seller:i.seller,
          owner:i.owner,
          image:meta.data.image
        }
        return item
      }))

    const soldItems = items!==null ? items.filter(i=>i.sold) : []

    setNfts(items)
    setSold(soldItems)
    setLoadingState('loaded')

    }catch(e){
      console.error(e)
    }
  }
  
  

  if(loadingState !='loaded' && !nfts.length) return(
    <h1>No assets owned</h1>
  )
  else return(
    <div>
      {items.map((nft)=>(
        <div key={nft.tokenId}>
          {nft.tokenId}
        </div>
      ))}
    </div>)
		

}
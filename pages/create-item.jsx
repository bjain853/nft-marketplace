import { useState } from "react";
import {ethers} from 'ethers';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import {useRouter} from 'next/router';
import Web3Modal from 'web3modal';
import Image from 'next/image'

import {
	nftaddress,nftmarketaddress,ipfsGateway
} from '../config';

const client = ipfsHttpClient(ipfsGateway)

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import {Button} from '@mui/material'
import {root,container,formField} from '../styles/pages/create-item.module.scss';

export default function CreateItem(){

	const [fileUrl,setFileUrl] = useState(null);
	const [formInput,updateFormInput] = useState({price:'',name:'',description:''});

	const router = useRouter();

	async function onChange(e){
		try{
			const file = e.target.files[0]
			const added = await client.add(
				file,
				{
					progress:(prog)=> console.log(`recevied: ${prog}`)
				}
			)
			const url = `${ipfsGateway}${added.path}`
			setFileUrl(url)
		}catch(e){
			console.error(e)
		}

	}
	async function createItem(){
		const {name,description,price}=formInput
		if(!name || !description || !price || !fileUrl) return
		
		const data = JSON.stringify({
			name,description,image:fileUrl
		})

		try{
			const added = await client.add(data)
			const url = `${ipfsGateway}${added.path}`
			createSale(url)
		}catch(error){
			console.error("Error uploading file: ",error)
		}
	}

	async function createSale(url){
		try{
			const web3modal = new Web3Modal()
			const connection = await web3modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			const signer = provider.getSigner()

			let contract = new ethers.Contract(nftaddress,NFT.abi,signer)
			let transaction = await contract.createToken(url)
			let tx = await transaction.wait()

			let event = tx.events[0]
			let value = event.args[2]
			let tokenId = value.toNumber()

			const price = new ethers.utils.parseUnits(formInput,price,'ether')

			contract = new ethers.Contract(nftmarketaddress,Market.abi,signer)
			let listingPrice = await contract.getListingPrice()
			listingPrice = listingPrice.toString()

			transaction = await contract.createMarketItem(
				nftaddress,tokenId,price,{value:listingPrice}
			)

			await transaction.wait()
		}catch(e){
			console.error(e)
		}finally{
			router.push('/')
		}
	}

	return(
		<div root={root}>
			<div class={container}>
				<input class={formField} type="text" onChange={e=>updateFormInput({...formInput,name:e.target.value})} placeholder="Asset Name"/>
				<textarea class={formField} name="" id="" cols="30" rows="10" onChange={e=>updateFormInput({...formInput,description:e.target.value})} placeholder="Asset Description"></textarea>
				<input class={formField} type="text" onChange={e=>updateFormInput({...formInput,price:e.target.value})} placeholder="Asset price in Ether"/>
				<input class={formField} onChange={onChange} type="file"/>
				{fileUrl &&
				(<Image src={fileUrl} alt="uploaded file"/>)
			}
				<Button variant="contained" onClick={createItem}>
					Sell your Digital Asset
				</Button>
			</div>	
		</div>
	)
}
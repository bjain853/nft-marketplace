import { ethers } from "hardhat";

describe("NFTMarket",()=>{
	it("Should create and execute market sales",async ()=>{
		const Market = await ethers.getContractFactory("NFTMarket")
		const market = await Market.deploy();
		await market.deployed();
		const marketAddress = market.address;

		const NFT = await ethers.getContractFactory("NFT");
		const nft = await NFT.deploy(marketAddress);
		await nft.deployed();
		const nftContractAddress = nft.address;

		const listingPrice = await market.getListingPrice();
		const listingPriceString = listingPrice.toString();

		const auctionPrice = ethers.utils.parseUnits('100','ether');

		await nft.createToken("https://www.mytokenlocation.com");
		await nft.createToken("https://www.mytokenlocation2.com");

		await market.createMarketItem(nftContractAddress,1,auctionPrice,{value:listingPriceString});
		await market.createMarketItem(nftContractAddress,2,auctionPrice,{value:listingPriceString});

		const [_,buyerAddress] = await ethers.getSigners();

		await market.connect(buyerAddress).createMarketSale(nftContractAddress,1,{value:auctionPrice});

		const items = await market.fetchMarketItems();

		let itemDeserialized = await Promise.all(items.map(async i =>{
			const tokenUri = await nft.tokenURI(i.tokenId);
			let item = {
				price : i.price.toString(),
				tokenId : i.tokenId.toString(),
				seller : i.seller,
				owner : i.owner,
				tokenUri
			}
			return item;
		}));

		console.log("items: ",itemDeserialized);

	});
});
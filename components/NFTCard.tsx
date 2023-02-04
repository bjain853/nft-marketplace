import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import NFT from '../types/nft'

export default function NFTCard(nft:NFT){


	return(
		<Card sx={{ maxWidth: 345 }}>
		<CardMedia
		  component="img"
		  alt="nft image"
		  height="140"
		  image={nft.image}
		/>
		<CardContent>
		  <Typography gutterBottom variant="h5" component="div">
		    {nft.name}
		  </Typography>
		  <Typography variant="body2" color="text.secondary">
		   {nft.description}
		  </Typography>
		</CardContent>
		<CardActions>
		  <Button size="large">Buy</Button>
		</CardActions>
	      </Card>
	    )

}
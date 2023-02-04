import {useContext,useState} from 'react'
import UserContext from '../context'
import {pages} from '../types/pages'
 
import {AppBar,Toolbar,IconButton, Button} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../public/Logo.svg'
import styles from '../styles/components/NavBar.module.scss'
import { TypechainConfig } from '@typechain/hardhat/dist/types'


export const NavBar = () => {

  
  //const {user} = useContext(UserContext)
  const [user,setUser] = useState(null)
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton>
          <Link href="/">
            <Image src={Logo} alt="logo" height={55} width={55} className={styles.logo}/>
          </Link>
        </IconButton>
        <div className={styles.privateLinks}>
          {
            Object.keys(pages).map((pageName)=>(
              <Button key={pageName}>
                <Link href={pages[pageName]} className={styles.link}>
                  {pageName}
                </Link>
              </Button>
        
            ))
          }
        </div>
        {
          !user && <Button>
            <Link href='/login' className={styles.link}>
          Connect Wallet
            </Link>
          </Button>
        }
      </Toolbar>
    </AppBar>

  )
}

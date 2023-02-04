import Context from '../context'
import { NavBar } from '../components/NavBar'
import { ThemeProvider } from '@mui/material'
import { appTheme } from '../styles/theme'

function MyApp({ Component, pageProps }) {
  
  return( 
    <ThemeProvider theme={appTheme}>
      <Context>
        <NavBar/>
        <Component {...pageProps} />
      </Context>
    </ThemeProvider>
  )
 
}

export default MyApp

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className='appWrapper'>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp

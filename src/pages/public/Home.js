import React, {useEffect, useRef, useState} from 'react'
import './Home.css'
import shape from '../../assets/images/shape.png'
import heroImg from '../../assets/images/main-banner.png'
import featureShape from '../../assets/images/about-shape.png'
import fe from '../../assets/images/wheatFarm.jpg'
import useFade from '../../hooks/useFade'

function Home() {
  const {entry:entry1,...headingFade} = useFade('headings','fadeIn')
  const {entry:entry2,...divFadeIn} = useFade('preFade','fadeIn')
  const {entry:entry3,...divFadeInR} = useFade('preFadeRight','fadeIn')
  const {entry:entry4,...divFadeIn2} = useFade('preFade','fadeIn')
  const {entry:entry5,...divBorderRotate} = useFade('BorderAnimation','rotateIn')
  const {entry:entry6,...fadeUpFeatures} = useFade('headings preFadeUp','fadeIn')
  const featureImageRef = useRef()
  
  const [borderValues,setBorderValues] = useState([10,10,10,10])
  const [hovering,setHovering] = useState(false)


    useEffect(()=>{
      if(hovering){
        console.log('hovering....')
        setTimeout(()=>{
          const ram1 = Math.floor(Math.random()*101)
          const ram2 = Math.floor(Math.random()*101)
          const ram3 = Math.floor(Math.random()*101)
          const ram4 = Math.floor(Math.random()*101)
          const newBorderVal = [ram1,ram2,ram3,ram4]
          setBorderValues(newBorderVal)
        },1000)
      }
    },[borderValues,hovering])

    const StyleBorderAnimation = {
      borderRadius: `${borderValues[0]}% ${borderValues[1]}% ${borderValues[2]}% ${borderValues[3]}%`
    }

  return (
    <>
      <div className='container-fluid p-0 m-0'>
        <div className='row'>
          <div className='col-lg-6 col-md-12 p-0 m-0 d-flex justify-content-center'>
            <div className='hero-sec w-75'>
              <h1 {...headingFade}>Changing farming with technology</h1>
              <p> AgriTech offers a variety of services including supply-chain management, inventory management, and more to help farmers grow sustainably.</p>
              <p>Use KissanCoin, our blockchain-based crypto-wallet, to easily and securely manage your finances, transactions, and assets.</p>
              <button className='btn btn-success'>What we do?</button>
            </div>
          </div>
          <div className='col-lg-6 col-md-12 p-0 m-0'>
            <div className='img-hero'>
              <div {...divBorderRotate}></div>
              <img className='img-hero-main' src={heroImg} alt='' />
              <div className='shape-area'>
                <div className='creative-shape'>
                  <img src={shape} alt='' />
                </div>
                <div className='creative-shape-2'>
                  <img src={shape} alt='' />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='features'>
          <div className='row m-5 align-items-center'>
            <div className='col-lg-6 col-md-12'>
                <h1 {...fadeUpFeatures}>Features</h1>
                <div onMouseEnter={()=>{setHovering(true)}}
                  onMouseLeave={()=>setHovering(false)}
                  ref={featureImageRef} style={StyleBorderAnimation} className='feat-img'><img src={fe} alt='' /></div>
            </div>
            <div className='col-lg-6 col-md-12 my-5 py-5'>
                <div className='text-left'>
                  <h2 {...divFadeIn}>Better management with KissanCoin</h2>
                  <p>Use KissanCoin, our blockchain-based crypto-wallet, to easily and securely manage your finances, transactions, and assets.</p>
                </div>
                <div className='text-right'>
                  <h2 {...divFadeInR}>Streamline operations</h2>
                  <p>AgriTech's supply-chain management and inventory management tools make it easy to manage your operations from seed to harvest.</p>
                </div>
                <div className='text-left'>
                  <h2 {...divFadeIn2}>Access to farming equipment</h2>
                  <p>Easily buy or rent the equipment you need with AgriTech's marketplace for farming equipment.</p>
                </div>
            </div>
          </div>
          <div className='features-shape-img'>
            <img src={featureShape} alt='' />
          </div>
        </div>

      </div>
    </>
  )
}

export default Home
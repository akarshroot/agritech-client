import React from 'react'
import './Home.css'
// import HomeImg1 from '../../assets/backgrounds/plantation.jpg'
// import HomeImg2 from '../../assets/backgrounds/vegetables.jpg'
// import HomeImg3 from '../../assets/backgrounds/tractor-on-farmland.jpg'
import shape from '../../assets/images/shape.png'
import heroImg from '../../assets/images/main-banner.png'
import featureShape from '../../assets/images/about-shape.png'
import fe from '../../assets/images/fe.png'

function Home() {
  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-6 col-md-12'>
            <div className='hero-sec'>
              <h1 className='headings'>Revolutionizing farming with technology</h1>
              <p> AgriTech offers a variety of services including supply-chain management, inventory management, and more to help farmers grow sustainably.</p>
              <p>Use KissanCoin, our blockchain-based crypto-wallet, to easily and securely manage your finances, transactions, and assets.</p>
              <button className='btn btn-success'>What we do?</button>
            </div>
          </div>
          <div className='col-lg-6 col-md-12'>
            <div className='img-hero'>
              <img src={heroImg} alt='' />
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
          <div className='row m-5'>
            <div className='col-lg-6 col-md-12'>
                <h1 className='headings'>Features</h1>
                <div className='feat-img'><img src={fe} alt='' /></div>
            </div>
            <div className='col-lg-6 col-md-12 my-5 py-5'>
                <div className='text-left'>
                  <h2>Better management with KissanCoin</h2>
                  <p>Use KissanCoin, our blockchain-based crypto-wallet, to easily and securely manage your finances, transactions, and assets.</p>
                </div>
                <div className='text-right'>
                  <h2>Streamline operations</h2>
                  <p>AgriTech's supply-chain management and inventory management tools make it easy to manage your operations from seed to harvest.</p>
                </div>
                <div className='text-left'>
                  <h2>Access to farming equipment</h2>
                  <p>Easily buy or rent the equipment you need with AgriTech's marketplace for farming equipment.</p>
                </div>
            </div>
          </div>
          <div className='features-shape-img'>
            <img src={featureShape} alt='' />
          </div>
          
        </div>
        

      </div>
      {/* <div className="home-container">
        <div className="section">
          <div className="left">
            <div className="section-text">
              <h1>Revolutionizing farming with technology.</h1>
              <div className="subtext">
                AgriTech offers a variety of services including supply-chain management, inventory management, and more to help farmers grow sustainably.
              </div>
            </div>
          </div>
          <div className="right right-img">
            <img src={HeroImg} alt="" />
          </div>
        </div>
        <div className="section">
          <div className="left left-img">
            <img src={HomeImg1} alt="" />
          </div>
          <div className="right">
            <div className="section-text">
              <h2>Better management with KissanCoin.</h2>
              <div className="subtext">
                Use KissanCoin, our blockchain-based crypto-wallet, to easily and securely manage your finances, transactions, and assets.
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="left">
            <div className="section-text">
              <h2>Streamline operations.</h2>
              <div className="subtext">
                AgriTech's supply-chain management and inventory management tools make it easy to manage your operations from seed to harvest.
              </div>
            </div>
          </div>
          <div className="right right-img">
            <img src={HomeImg2} alt="" />
          </div>
        </div>
        <div className="section">
          <div className="left left-img">
            <img src={HomeImg3} alt="" />
          </div>
          <div className="right">
            <div className="section-text">
              <h2>Access to farming equipment.</h2>
              <div className="subtext">
                Easily buy or rent the equipment you need with AgriTech's marketplace for farming equipment.
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default Home
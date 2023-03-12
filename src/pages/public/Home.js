import React from 'react'
import './Home.css'
import HeroImg from '../../assets/backgrounds/tractors.jpg'
import HomeImg1 from '../../assets/backgrounds/plantation.jpg'
import HomeImg2 from '../../assets/backgrounds/vegetables.jpg'
import HomeImg3 from '../../assets/backgrounds/tractor-on-farmland.jpg'

function Home() {
  return (
    <>
      <div className="home-container">
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
      </div>
    </>
  )
}

export default Home
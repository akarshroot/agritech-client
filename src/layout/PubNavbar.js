import React, { useEffect, useState } from 'react'
import './PubNavbar.css'
import hamburger from '../assets/icons/hamburger-menu.svg'
import hamburgerDark from '../assets/icons/hamburger-menu-dark.svg'
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import logo from '../assets/logo/logoCenterText.svg'

function Navbar() {

    const [navState, setNavState] = useState(false)
    const [screenWidth, setScreenWidth] = useState(getWindowSize())
    const [loading, setLoading] = useState(false)

    const [mobileMenuState, toggleMobileMenuState] = useState(false)

    const navigate = useNavigate()
    const { currentUser, logout, theme } = useUser()

    function openMobileMenu() {
        toggleMobileMenuState(true)
    }

    function closeMobileMenu() {
        toggleMobileMenuState(false)
    }

    function getWindowSize() {
        const { innerWidth } = window
        return innerWidth
    }

    useEffect(() => {
        function handleWindowResize() {
            setScreenWidth(getWindowSize())
        }
        window.addEventListener('resize', handleWindowResize)
        return () => {
            window.removeEventListener('resize', handleWindowResize)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        window.addEventListener("scroll", () => {
            let scrollPosition = window.pageYOffset || window.scrollY || document.body.scrollTop || document.documentElement.scrollTop;
            if (scrollPosition > 0) {
                setNavState(true)
            } else {
                setNavState(false)
            }
        })
        // if (userData) {
        if (currentUser) {
            setLoading(false)
        }
    }, [currentUser])


    return (
        // style={navState ? { backgroundColor: "var(--c1)", color: "var(--base-text)" } : { backgroundColor: "var(--c2)", color: "var(--base-text)" }}
        <div className={`nav-container theme-${theme}`} >
            <div className="nav-icon-container">
                <img src={navState ? hamburger : hamburgerDark} alt="" id="hamburger" onClick={openMobileMenu} />
            </div>
            <div className="nav-title">
                <h1 onClick={() => { navigate("/") }}>
                    <img src={logo} width='70%' alt='' />
                </h1>
            </div>
            <ul className={screenWidth > 665 ? "nav-tabs-container" : "nav-tabs-container-mobile"} style={screenWidth > 665 ? { marginLeft: "0px" } : (mobileMenuState ? { marginLeft: "0vw" } : { marginLeft: "-200vw" })}>
                <li id="close-mobile-menu" onClick={closeMobileMenu}>X</li>
                <li className={navState ? "nav-tab nav-tab-hover" : "nav-tab nav-tab-hover-dark"} onClick={() => { navigate("/") }}>Home</li>
                {currentUser ? loading ? <>Loading...</> : <li className={navState ? "nav-tab-btn nav-tab-btn-hover" : "nav-tab-btn nav-tab-btn-hover-dark"} onClick={() => {navigate("/dashboard"); closeMobileMenu()}}>Dashboard</li> : <></>}
                <li className={navState ? "nav-tab-btn nav-tab-btn-hover" : "nav-tab-btn nav-tab-btn-hover-dark"} style={navState ? { borderColor: "var(--c1)", boxShadow: "inset 0 0 0 0 var(--c1)" } : { borderColor: "var(--c3)" }} onClick={currentUser ? logout : () => { navigate("/login"); closeMobileMenu() }}>{currentUser ? loading ? <>Loading...</> :  "Logout" : "Login"}</li>
            </ul>
        </div >
    )
}

export default Navbar
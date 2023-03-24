import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import './PrivateNav.css'

function PrivateNav(props) {
    const { currentUser, logout } = useUser()
    const [tab, setTab] = useState(window.location.pathname.split("/")[1])

    useEffect(() => {
        if(!currentUser) logout()
        setTab(window.location.pathname.split("/")[1])
        return () => {
            setTab("dashboard")
        }
    }, [window.location.pathname])

    return (
        <div className={`private-nav theme-${props.theme}`}>
            <h4>AgriTech Console</h4>
            <ul className='links-container'>
                <Link className={`link theme-${props.theme}`} to="/dashboard"><li className={`nav-element ${tab === "dashboard" ? "nav-element-selected" : ""}`}>Dashboard</li></Link>
                <Link className={`link theme-${props.theme}`} to="/wallet"><li className={`nav-element ${tab === "wallet" ? "nav-element-selected" : ""}`}>Wallet</li></Link>
                <Link className={`link theme-${props.theme}`} to="/management"><li className={`nav-element ${tab === "management" ? "nav-element-selected" : ""}`}>Management</li></Link>
                <Link className={`link theme-${props.theme}`} to="/campaigns"><li className={`nav-element ${tab === "campaigns" ? "nav-element-selected" : ""}`}>Campaigns</li></Link>
                <Link className={`link theme-${props.theme}`} to="/agristore"><li className={`nav-element ${tab === "agristore" ? "nav-element-selected" : ""}`}>AgriStore</li></Link>
                <li className='nav-element-btn' onClick={() => logout()}>LOGOUT</li>
            </ul>
        </div>
    )
}

function PrivateBody(props) {
    const Body = props.body
    const navigate = useNavigate()

    const { currentUser, theme, userData } = useUser()
    if(!currentUser) {navigate("/")}
    return (
        <>
            <PrivateNav theme={theme} />
            <div className="body">
                <Body theme={theme} />
            </div>
        </>
    )
}

export default PrivateBody
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
            <h3>AgriTech Console</h3>
            <ul className='links-container'>
                <Link className={`link theme-${props.theme}`} to="/dashboard"><li className={`nav-element ${tab == "dashboard" ? "nav-element-selected" : ""}`}>Dashboard</li></Link>
                <Link className={`link theme-${props.theme}`} to="/wallet"><li className={`nav-element ${tab == "wallet" ? "nav-element-selected" : ""}`}>Wallet</li></Link>
                <Link className={`link theme-${props.theme}`} to="/management"><li className={`nav-element ${tab == "management" ? "nav-element-selected" : ""}`}>Management</li></Link>
                <Link className={`link theme-${props.theme}`} to="/campaigns"><li className={`nav-element ${tab == "campaigns" ? "nav-element-selected" : ""}`}>Campaigns</li></Link>
                <Link className={`link theme-${props.theme}`} to="/agristore"><li className={`nav-element ${tab == "agristore" ? "nav-element-selected" : ""}`}>AgriStore</li></Link>
                <li className='link nav-element-btn' onClick={() => logout()}>Logout</li>
            </ul>
        </div>
    )
}

function PrivateBody(props) {
    const Body = props.body
    const { currentUser, theme, userData } = useUser()

    return (
        <>
            <PrivateNav theme={theme} />
            <div className="body">
                <Body />
            </div>
        </>
    )
}

export default PrivateBody
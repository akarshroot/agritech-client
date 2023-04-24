import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import FontAwesome from 'react-fontawesome'
import './PrivateNav.css'
import Button from 'react-bootstrap/Button'

function PrivateNav(props) {
    const { currentUser, logout, loading } = useUser()
    const [tab, setTab] = useState(window.location.pathname.split("/")[1])
    const [hamShow,setHamShow] = useState(false)

    useEffect(() => {
        setTab(window.location.pathname.split("/")[1])
        return () => {
            setTab("dashboard")
        }
    }, [window.location.pathname, currentUser, loading])

    return (
        <>
            <div className={`private-nav d-none d-md-block theme-${props.theme}`}>
                <div className='display-5 logoConsole'>
                    AgriTech Console
                </div>
                <div className='d-flex justify-content-between pt-1'>
                    <div className='links-container'>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/dashboard"><li className={`nav-element ${tab === "dashboard" ? "nav-element-selected" : ""}`}>Dashboard</li></Link>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/wallet"><li className={`nav-element ${tab === "wallet" ? "nav-element-selected" : ""}`}>Wallet</li></Link>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/management"><li className={`nav-element ${tab === "management" ? "nav-element-selected" : ""}`}>Management</li></Link>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/campaigns"><li className={`nav-element ${tab === "campaigns" ? "nav-element-selected" : ""}`}>Campaigns</li></Link>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/agristore"><li className={`nav-element ${tab === "agristore" ? "nav-element-selected" : ""}`}>AgriStore</li></Link>
                    </div>
                    <div className='px-3'>
                        <Button variant='btn bg-warning bg-opacity-75' onClick={() => logout()}>LOGOUT</Button>
                    </div>
                </div>
            </div>

            <div className={`private-nav d-block d-md-none theme-${props.theme}`}>
                <div className='display-5 logoConsole'>AgriTech Console</div>
                <div className='hamButtonNav'>
                    <FontAwesome name='bars' onClick={() => setHamShow(!hamShow)} className="fa-solid fa-bars" />
                    <Button variant='btn bg-warning bg-opacity-75' onClick={() => logout()}>LOGOUT</Button>
                </div>
                <div className={`dropDownNav ${hamShow? 'showDropDownNav':''}`}>
                    <ul className='links-container p-0'>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/dashboard"><li className={`nav-element ${tab === "dashboard" ? "nav-element-selected" : ""}`}>Dashboard</li></Link>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/wallet"><li className={`nav-element ${tab === "wallet" ? "nav-element-selected" : ""}`}>Wallet</li></Link>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/management"><li className={`nav-element ${tab === "management" ? "nav-element-selected" : ""}`}>Management</li></Link>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/campaigns"><li className={`nav-element ${tab === "campaigns" ? "nav-element-selected" : ""}`}>Campaigns</li></Link>
                        <Link onClick={()=> setHamShow(false)} className={`link theme-${props.theme}`} to="/agristore"><li className={`nav-element ${tab === "agristore" ? "nav-element-selected" : ""}`}>AgriStore</li></Link>
                    </ul>
                </div>
            </div>
        </>
    )
}

function PrivateBody(props) {
    const Body = props.body
    const navigate = useNavigate()

    const { currentUser, theme, checkTokenCookie, loading } = useUser()


    useEffect(() => {
        if (!checkTokenCookie && !currentUser) { navigate("/") }
    })

    return (
        <>

            {
                loading ?
                    <>Loading...</>
                    :
                    <>
                        <PrivateNav theme={theme} />
                        <div className="body">
                            <Body theme={theme} />
                        </div>
                    </>
            }
        </>
    )
}

export default PrivateBody
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import './Signup.css'

function Signup() {
    const email = useRef()
    const phno = useRef()
    const password = useRef()
    const repassword = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const {theme} = useUser()    

    async function processSignup(e) {
        e.preventDefault()
        setLoading(true)
        try {
            await new Promise((res, rej) => {setTimeout(()=>res(), 3000)})
        } catch (e) {
            setError(e.message)
        }
        setLoading(false)
    }

    return (
        <>
            <div className="bg-signup"></div>
            <div className="bg-overlay"></div>
            <div className={`signup-container theme-${theme}`}>
                <h1>SIGN UP</h1>
                <div className="error-message" hidden={!error}>{error}</div>
                <form onSubmit={(e) => processSignup(e)} id="signup">
                    <input ref={email} placeholder="Email" className='form-input' type="email" id="email" required /><br/>
                    <input ref={phno} placeholder="Phone Number" className='form-input' type="number" id="phno" required /><br/>
                    <input ref={password} placeholder="Password" className='form-input' type="password" id="password" required /><br/>
                    <input ref={repassword} placeholder="Re-type password" className='form-input' type="password" id="re-password" required /><br/>
                    <input className='form-input' type="submit" value={loading ? "Please Wait..." : "Signup"} disabled={loading} />
                </form>
                <span>Already a member? <Link to="/login">Login here</Link></span>
            </div>
        </>
    )
}

export default Signup
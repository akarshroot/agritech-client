import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useUser } from '../../context/UserContext'
import './Login.css'

function Login() {
    const email = useRef()
    const password = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const {theme, login} = useUser()    

    async function processLogin(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        const credentials = {
            email: email.current.value,
            password: password.current.value
        }
        try {
            await login(credentials)
        } catch (e) {
            setError(e.message)
        }
        setLoading(false)
    }

    return (
        <>
        <div>
            <div className="bg-login"></div>
            <div className="bg-overlay"></div>
            <div className={`p-5 bg-success bg-opacity-50 text-light login-container theme-${theme}`}>
                <h1>LOGIN</h1>
                <div className="error-message" hidden={!error}>{error}</div>
                <div className='row justify-content-center'>
                    <form className='col-md-4' onSubmit={(e) => processLogin(e)} id="login">
                        <input ref={email} className='form-control' placeholder='Email' type="email" id="email" required /><br/>
                        <input ref={password} className='form-control' placeholder='Password' type="password" id="password" required /><br/>
                        <input className='form-input btn btn-success' type="submit" value={loading ? "Please Wait..." : "Login"} disabled={loading} />
                    </form>
                </div>
                <span>Not a member? <Link to="/signup" className='text-light '>Create an account</Link> today!</span>
            </div>
        </div>
        </>
    )
}

export default Login
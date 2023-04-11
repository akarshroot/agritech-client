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
        <div className="bg-login"></div>
        <div className="bg-overlay"></div>
        <div className="container login-body d-flex justify-content-center align-items-center">
            <div className='row'>
                <div className={`login-container col-12 p-4 rounded theme-${theme}`}>
                    <h1 className='display-3'>Login</h1>
                    <div className="error-message" hidden={!error}>{error}</div>
                    <Form className='form-control bg-transparent border-0' onSubmit={(e) => processLogin(e)} id="login">
                        <input ref={email} placeholder="Email" className='form-control' type="email" id="email" required /><br/>
                        <input ref={password} placeholder="Password" className='form-control' type="password" id="password" required /><br/>
                        <Button variant='success' className='form-control' type="submit" disabled={loading} >
                            {loading ? "Please Wait..." : "Login"}
                        </Button>
                    </Form>
                    <span>Not a member? <Link to="/signup">Create an account</Link> today!</span>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login
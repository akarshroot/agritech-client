import React from 'react'
import Navbar from './PubNavbar'

function PublicBody(props) {
    const Body = props.body
    return (
        <>
            <Navbar />
            <div className="body">
                <Body />
            </div>
        </>
    )
}

export default PublicBody
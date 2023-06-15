import React, { useEffect, useState } from 'react'
import './Profile.css'
import ProfileTabs from './ProfileTabs'

function Profile() {

    return (
        <>
            <div className='profile-into-sec'>
                <h2>Manage your account</h2><br></br>
            </div>

            <div className='three-profile-panes'>
                <ProfileTabs />
            </div>

        </>
    )
}

export default Profile
import React from 'react'
import './Profile.css'
import ProfileTabs from './ProfileTabs'

function Profile() {

    return (
        <>
            <div className='profile-intro-sec'>
                <h2>Manage your account</h2>
            </div>

            <div className='three-profile-panes'>
                <ProfileTabs />
            </div>

        </>
    )
}

export default Profile
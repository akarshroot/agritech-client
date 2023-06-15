import React from 'react'
import { useUser } from '../../context/UserContext'
import './Roadblock.css'

function Roadblock() {

    const userData = useUser()
    return (
        <div className='parent-roadblock'>
            <div>
                <form className='roadblock-form'>
                    <div className='profile-label-ip'>
                        <label className='profile-label' for="profile-phno">Mobile :</label>
                        <input
                            type="number"
                            className='profile-phno profile-ip'
                            id="profilePhno"
                            name="phno"
                            value={userData?.phno}
                            placeholder='Enter your Mobile Number'
                            required
                        />
                    </div>
                    <div className='profile-label-ip'>
                        <label className='profile-label' for='landArea'>Land Area :</label>
                        <input
                            type="float"
                            value={userData?.landArea}
                            name="landArea"
                            className='profile-ip'
                            placeholder='Enter land area in heactares'
                            required
                        />
                    </div>
                    <div className='profile-label-ip'>
                        <label className='profile-label' for='landRegion'>Land Region :</label>
                        <input
                            type="text"
                            value={userData?.region}
                            name="region"
                            className='profile-ip'
                            placeholder="Enter your land's region"
                            required
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Roadblock
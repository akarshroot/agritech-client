import React, {useState} from 'react'
import {getCampbyId} from '../interceptors/serverAPIs'
import {useNavigate} from 'react-router-dom'

const CampaignContext = React.createContext()

export function CampaignContextProvider({children}) {

    const [activeCampaign,setActiveCampaign] = useState(null)
    const navigate = useNavigate()
    async function changeActiveCampaign(id){
        const res = await getCampbyId(id)
        setActiveCampaign(res)
        navigate('/detailedCampaign',{replace:true})
    }
    const values = {
        activeCampaign,
        changeActiveCampaign
    }
    return (
        <CampaignContext.Provider value={values}>
            {children}
        </CampaignContext.Provider>
    )
}

export default CampaignContext

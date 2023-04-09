import React, {useState} from 'react'
import {getCampbyId} from '../interceptors/serverAPIs'
import {useNavigate} from 'react-router-dom'

const CampaignContext = React.createContext()

export function CampaignContextProvider({children}) {

    const [activeCampaign,setActiveCampaign] = useState(null)
    const navigate = useNavigate()
    async function changeActiveCampaign(id){
        let idtoUse = id
        if(!idtoUse){
            idtoUse = localStorage.getItem("activeCamp")
        }
        const res = await getCampbyId(idtoUse)
        setActiveCampaign(res)
        localStorage.setItem('activeCamp',idtoUse)
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

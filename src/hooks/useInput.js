import {useState} from 'react'

export default function useInput(type,placeholder) {
    
    const [data,setData] = useState('')

    function handleChange(e){
        // console.log(e.target.value)
        setData(e.target.value)
    }
  
    return (
        {
            type,
            onChange:handleChange,
            value:data,
            placeholder,
            required:true,
            setData
        }
  )
}

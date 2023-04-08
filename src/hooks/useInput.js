import {useState} from 'react'

export default function useInput(type,placeholder) {
    
    const [data,setData] = useState('')

    function handleChange(e){
        // console.log(e.target.value)
        e.target
        ? setData(e.target.value)
        : setData(e)
    }
    const className = 'form-control' 
    return (
        {
            className,
            type,
            onChange:handleChange,
            value:data,
            placeholder,
            required:true
        }
  )
}

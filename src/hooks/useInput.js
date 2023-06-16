import {useState} from 'react'

export default function useInput(type,placeholder, defaultValue) {
    
    const [data,setData] = useState(defaultValue ? defaultValue : "")

    function handleChange(e){
        // console.log(e.target.value)
        e.target
        ? setData(e.target.value)
        : setData(e)
    }
    // const className = 'input-neumorph'
    return (
        {
            // className,
            type,
            onChange:handleChange,
            value:data,
            placeholder,
            required:true
        }
  )
}
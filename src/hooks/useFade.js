import {useEffect} from 'react';
import { useInView } from 'react-intersection-observer'

export default function useFade(classes,classtoAdd) {

    const {ref, inView, entry} = useInView();

    useEffect(()=>{
        inView
        ? classtoAdd.split(' ')?.forEach(e=>{
                entry?.target.classList.add(e)
            })
        : classtoAdd.split(' ')?.forEach(e=>{
            entry?.target.classList.remove(e)
        })
    },[inView])

    return {
        ref,
        entry,
        className:classes
    }
}

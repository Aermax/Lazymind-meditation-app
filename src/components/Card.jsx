import React,{useRef,useState,useEffect} from 'react'
import {Link,useParams,useNavigate} from "react-router-dom"


const Card = ({name, id,  photo, savelike, music}) => {

    const audiotag = useRef();

    const [time,setTime] = useState('0')


    useEffect(()=>{
        setTimeout(()=>{
            const result = Math.floor(audiotag.current.duration/60)
        setTime(result)
        },100)
    },[])

    return (

        <>
        <Link to={"/session/" + id}>
        

         <div  className="card">
         <audio src={music} ref={audiotag}></audio>
            <img src={photo} alt="cover" />
            <div className="time-in-minutes">{time} MIN </div>
           
            <p>{name}</p>
        </div>
        </Link>
       {/* <div onClick={(e)=>{savelike(e)}} className="icon-like">
       <FavoriteBorderIcon />
       </div> */}
        </>
        
    )
}

export default Card
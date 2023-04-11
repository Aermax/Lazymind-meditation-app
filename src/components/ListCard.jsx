import React,{useRef,useState,useEffect} from 'react'
import {Link,useParams,useNavigate} from "react-router-dom"

const ListCard = ({name, id, photo}) => {

    const navigate = useNavigate()

    function handleNavigate(){
        navigate("/session/" + id)
        window.location.reload(false);
    }


    return (

        <>
         <a   className="list-card card" href={"/session/" + id}>
            <img src={photo} alt="cover" />
            <p>{name}</p>
        </a>
        </>
        
    )
}

export default ListCard
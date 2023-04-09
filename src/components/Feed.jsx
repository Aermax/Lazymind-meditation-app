import React, { useState, useEffect } from 'react'
import Card from "./Card"
import data from "../data.js"
import {auth, db} from "../firebase-config.js"
import { onAuthStateChanged } from 'firebase/auth'
import { getDocs,collection, query} from 'firebase/firestore'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const Feed = () => {
    const [sessions, setSessions] = useState([])
    const [liked,setLiked] = useState([])
    const [queryResult,setQuery] = useState([])
    const [hasLiked,setHasLiked] = useState(false)
    const [isLoading,setLoading] = useState(false)
    
    const likes = [7, 6 ,4]

    const storageRef = collection(db,'likedPost')
    
    function savelike(e){
        console.log(e)
    }


    const fetchSession = async() => {
        setSessions(data)
        try {
            const likedPosts =await getDocs(storageRef)
            const cleanedData = likedPosts.docs.map((doc)=>({
                ...doc.data(),
                 id: doc.id
                }))
                // console.log(cleanedData);
            setQuery(cleanedData)
            // console.log(cleanedData)
            const likedDocs = cleanedData.map((doc)=>{
                if(doc.userid === auth.currentUser.uid){
                    return doc.videoid
                }
            })
            // console.log(likedDocs)

            const newlikes = data.filter((item)=>{
                if (likedDocs.includes(item._id)) return item
            })
            setLiked(newlikes)
            setLoading(false)
            // console.log(newlikes)
            
            
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
        

        
        
        
    
    }



    useEffect(() => {
      setLoading(true)
      fetchSession()
      
        
    }, [])

    


    return isLoading ? 
    <Box sx={{ display: 'flex',justifyContent:'center',alignItems:'center', height:'90vh'}}>
        <CircularProgress color='inherit'/>
    </Box> : (<div >
        {
            liked.length != 0 && (
                <div >
            <h1 className="col-title">My Favourites</h1>
            <div className="card-grid">
            {

                liked.map((session) => {
                    return (
                        <Card
                            key={session.name}
                            id={session._id}
                            name={session.name}
                            photo={"../" + session.photo}
                            music={"../" + session.music}
                            savelike={savelike}


                        />)
                })
                }
            </div>
            
        </div>
        
            )
        }

        {
            liked.length != 0 && (
                <hr />
            )
        }

        
        <h1 className="col-title">All Meditations</h1>
        <div className="card-grid">
                    {sessions.map((session) => {
                        return (
                            <Card
                                key={session.name}
                                id={session._id}
                                name={session.name}
                                photo={"../" + session.photo}
                                music={"../" + session.music}


                            />)
                    })}
        </div>
    </div>
        
    )
}

export default Feed
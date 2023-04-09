import React,{useState,useRef,useEffect} from 'react'
import {useParams,Navigate} from "react-router-dom"
import {auth,db} from "../firebase-config"
import { 
    addDoc,
    collection,
    getDoc,
    getDocs,
    deleteDoc,
    doc,
} from 'firebase/firestore'
import {Box} from '@mui/material'
import {CircularProgress} from '@mui/material'


import Navbar from "./Navbar"
import Comment from './Comment'
import data from "../data.js"
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseIcon from '@mui/icons-material/Pause';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import { Icon } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {IconButton,Button} from '@mui/material';
import ListCard from './ListCard'




const Session = () => {
   
    let {id} = useParams()
    const mainId = id
    const [sessions, setSessions] = useState(data)
    const [listCards,setListCards] = useState([])
    const [isEnded,setEnded] = useState(false)
    const [totalTime,setTotalTime] = useState(false)
    const [isLoading,setLoading] = useState(false)
    // const [currentUrl, setUrl] = useState(Number(id))
  
    const storageRef = collection(db,'likedPost')

    const [isPlaying, setPlaying] = useState(false)
    const audio = useRef()
    const clickRef = useRef()
    const [liked,setLiked] = useState(false)
    const [likedId,setLikedId] = useState(null)

 
    let prop = sessions.find((item)=>item._id == id)
    
    const [currentSong, setCurrentSong] = useState(prop)

    const {name, photo, music} = currentSong
   

    const isLiked = async()=>{

        try {
            const data = await getDocs(storageRef)
            const cleanedData = data.docs.map((doc)=>({
            ...doc.data(),
             id: doc.id
            }))
        
            const likedDocs = cleanedData.forEach((doc)=>{
            if(doc.userid === auth.currentUser.uid && doc.videoid == id){
                setLikedId(doc.id)
                setLiked(true)
                return doc.videoid

            }

        })
        } catch (error) {
            console.log(error)

        }

    }

    const fetchSong = async()=>{


            setLoading(true)
            let prop = sessions.find((item)=>item._id == id)
            let listItems = sessions.filter((item)=>item._id != id)
            setListCards(listItems)


        
       setTimeout(()=>{

        isLiked()
        if(currentSong.progress != null) {
            setTotalTime(true)
        }},1)

        setLoading(false)

    }

    
    useEffect(()=>{
        fetchSong()

    },[liked])
 
   
    const addFavourite =async()=>{
        const item = ({
            userid: auth.currentUser.uid,
            videoid: currentSong._id,
        })

        try {
            await addDoc(storageRef,item)
            isLiked()
            
        } catch (error) {
            console.log(error)
        }
    }

    const removeFavourite = async(favoriteid)=>{
        try {
            const favoriteDoc = doc(db,'likedPost',favoriteid)
            await deleteDoc(favoriteDoc)
            setLiked(false)
            
        } catch (error) {
            console.log(error)
        }
    }

    const playSong = (audio) => {
        if (!isPlaying) {
            audio.current.play()
            setPlaying(true)



        }
        else if (isPlaying) {
            audio.current.pause()
            setPlaying(false)

        }

    }

    const progressUpdate = ()=>{
        const duration = audio.current.duration;
        const ct = audio.current.currentTime;

        setCurrentSong({...prop, "progress":ct/duration * 100, "length": duration})
    }

    function convert(value) {
    return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
}
    const checkWidth = (e)=>{
        let width = clickRef.current.clientWidth;

        const offset = e.nativeEvent.offsetX;

        const divprogress = offset / width * 100;
        audio.current.currentTime = divprogress / 100 * currentSong.length;
    }

    const replayten = (e)=>{
        audio.current.currentTime = ((currentSong.progress * currentSong.length)/100) - 10
    }

    const forwardten = (e)=>{
        audio.current.currentTime = ((currentSong.progress * currentSong.length)/100) + 10
    }

    


    

    return (
       <>
       <Navbar />


        {
            isLoading ?  
            <Box sx={{ display: 'flex',justifyContent:'center',alignItems:'center', height:'20vh'}}>
                <CircularProgress color='inherit'/>
            </Box> : (
    <div className="flex-layout">
        
        <div className='flex-second'>
            <div className="session" style={{backgroundImage:`url(../${photo})`}}>
                
                <audio src={"../"+music} ref={audio} onEnded={()=>{setEnded(true)}} onTimeUpdate={()=>{progressUpdate()}}></audio>

                {/* <img  src={"../"+photo} alt="cover" /> */}
                
            
                <div className='music-div'>
                <div className='flex'>
                <p>{name}</p>
                <Button aria-label="Delete" onClick={()=>{liked ? 
                    removeFavourite(likedId): 
                    addFavourite()}} 
                    sx={liked ? 
                    {color:'#C13584',
                } : 
                    {color:'black'}
                }
                    value='100%'
                    // variant={liked ? "contained" : variant="outline" || 'outline'}
            
                    >
                        {
                            liked ? <FavoriteIcon /> : <FavoriteBorderIcon />
                        }
                    
                </Button>
            </div>
            <div className="time">
                {
                    currentSong.progress ? (
                        <p style={{height:'25px'}}>{currentSong.progress && Math.floor(((currentSong.progress /100) * currentSong.length) / 60)+
                        ':'+Math.floor(((currentSong.progress /100) * currentSong.length) % 60) }</p>
                    ) : <p ></p>
                }
                
                {
                    currentSong.progress ? (
                        <p>{currentSong.length && Math.floor(currentSong.length / 60) +
                        ':'+Math.floor(currentSong.length % 60)}</p>
                    ) : null
                }
                
               
            </div>
            <div className="progress-container"  onClick={(e)=>{checkWidth(e)}} ref={clickRef}>
                <div className="progress" style={{width:`${currentSong.progress+"%"}`}}>
                    <div></div>
                </div>
            </div>
            <div className="icon-div">
            
                <IconButton sx={{color:"black"}} >
                    <Replay10Icon onClick={(e)=>{replayten(e)}} sx={{fontSize:"30px",pt:"5px"}}/>
                </IconButton>
                {isPlaying ? 
                <IconButton sx={{color:"black"}}>
                    <PauseIcon sx={{fontSize:"40px" }}  onClick={()=>{playSong(audio)}}/>
                </IconButton> : 
                <IconButton sx={{color:"black"}}> 
                    <PlayCircleIcon sx={{fontSize:"40px"}} className='play' onClick={()=>{playSong(audio)}}/>
                </IconButton>}
                <IconButton sx={{color:"black"}}>
                    <Forward10Icon onClick={()=>{forwardten()}} sx={{fontSize:"30px",pt:"5px"}}/>
                </IconButton>
                </div>
                </div>
                
                {isEnded && <h1 className="creditText" style={{color:'white',marginBottom:"10rem"}}>Have a great Day</h1>}
            
            </div>
            <Comment id={id}/>
        </div>
        
                <div className="flex-second">
                    <h3>Related</h3>
                   { listCards.map(({name,_id,photo})=>{
                    return (
                        <ListCard name={name} id={_id} photo={'../' +photo}/>
                    )
                   })}
                </div>
        </div>
        
            )
        }
       </>
    )
}

export default Session
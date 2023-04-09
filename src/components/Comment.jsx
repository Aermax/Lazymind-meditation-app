import React,{useEffect, useState} from 'react'
import { auth, db } from '../firebase-config'
import { addDoc,collection,deleteDoc,getDocs,doc } from 'firebase/firestore'
import { 
    TextField,
    Rating,
    Button,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import DeleteBorderIcon from '@mui/icons-material/Delete';
import {Grid} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import {Box} from '@mui/material'



const Comment = ({id}) => {

    const [input,setInput] = useState('')
    const [reviews,setReviews] = useState([])
    const [isRated,setRated] = useState(false)
    const [userReview,setUserReview] = useState({})
    const [isLoading,setloading] = useState(false)
    const [isSendLoading,setSendLoading] = useState(false)
    const [value,setValue] = useState(null)

    const storageRef = collection(db,'reviews')

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            setSendLoading(true)
            await addDoc(storageRef,{
                rating: value,
                userid:auth.currentUser.uid,
                username:auth.currentUser.displayName || (auth.currentUser.email.split('@')[0]),
                userimg:auth.currentUser.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                review:input,
                videoid:id
            })
            setInput('')
            fetchreviews()
            setSendLoading(false)
            
        } catch (error) {
            console.log(error)
            setSendLoading(false)
        }
        
    }

    const deleteReview = async(reviewId,userId)=>{
        try {
            setSendLoading(true)
            const deleteDocRef = doc(db,'reviews',reviewId)
            if(userId == auth.currentUser.uid){
                await deleteDoc(deleteDocRef)
                setRated(false)
                fetchreviews()
            }
            setSendLoading(false)
            
        } catch (error) {
            console.log(error)
            setSendLoading(false)
        }
    }

    const fetchreviews = async()=>{
        setloading(true)
        const data = await getDocs(storageRef)
        const filteredData = data.docs.map((item)=>({
            ...item.data(),
            id:item.id,
        }))

        const allreviews = filteredData.filter((item)=>{
            if(item.videoid == id){
                return item
            }
        })
        if(allreviews.find((item)=>item.userid == auth.currentUser.uid)) {
            setRated(true)

        }

        

        setReviews(allreviews)
        setloading(false)

    }

    const fetchUserReview = ()=>{
        const myReview = reviews.filter((item)=>item.userid == auth.currentUser.uid)
  
        setUserReview(myReview)

    }



    useEffect(()=>{

        fetchreviews()
        fetchUserReview()

    },[])

  return (
    <div>
        <h1 style={{marginLeft:"20%"}}>Reviews</h1>
    {
        
        isLoading ? <h1></h1> : (isRated ? null : (<div className="form reviewCard inputCard">

           
            <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            />
            <TextField id="outlined-basic" label="Write a review" variant="outlined"
             onChange={(e)=>{setInput(e.target.value)}} value={input}/>
            <LoadingButton
                size="small"
                color="inherit"
                sx={{backgroundColor:'#ffeec4',color:'#000'}}
                onClick={handleSubmit}
                loading={isSendLoading}
                loadingPosition="start"
                startIcon={<SendIcon />}
                variant="contained"
                >
                <span>Submit</span>
            </LoadingButton>

    </div>)) 
    }
    <div className='reviewGrid'>
        {/* {
            isRated && (
                <div >
                    <h1>{userReview.username}</h1>
                    <p>{userReview.review}</p>
                    {
                        userReview.userid == auth.currentUser.uid && <p onClick={()=>{deleteReview(userReview.id)}}>Delete</p>
                    }
                </div>
            )
        } */}
        {
            isLoading ?
            <Grid item>
                <Box sx={{ display: 'flex',justifyContent:'center',alignItems:'center'}}>
                    <CircularProgress color='inherit'/>
                </Box>
            </Grid> : (reviews.length != 0 && (reviews.map(({
                id,
                review,
                username,
                useremail,
                userid,
                rating,
                userimg,
            })=>{
                return <Grid item xs={4} className="reviewCard">
                    <div className=''>
                        <img src={userimg} alt="profilepic"/>
                        <p>{username != null ? username : useremail}</p>
                    </div>
                    <Rating name="read-only" value={rating} readOnly />
                    <h3>{review}</h3>
                    
                    {
                        userid == auth.currentUser.uid && <LoadingButton
                        size="small"
                        color="inherit"
                        sx={{backgroundColor:'#ffeec4',color:'#000'}}
                        onClick={()=>{deleteReview(id,userid)}}
                        loading={isSendLoading}
                        loadingPosition="start"
                        startIcon={<DeleteBorderIcon />}
                        variant="contained"
                        >
                        <span>Delete</span>
                    </LoadingButton>
                    }



                </Grid>
            })))
        }
    </div>

    </div>
  )
}

export default Comment
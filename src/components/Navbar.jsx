import React,{useEffect, useState} from 'react'
import { Link, redirect,useNavigate } from "react-router-dom"
import { auth } from "../firebase-config"
import { signOut,onAuthStateChanged } from 'firebase/auth'

const Navbar = () => {

    const [menu,setMenu] = useState(false)
    const navigate = useNavigate()
    const[UserActive,setUser] = useState(false)
    
    useEffect(()=>{
        setInterval(()=>{
            if (auth.currentUser) {
                setUser(true);
            }
        },1)
    },[])

    const logOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error(error)
        }
        navigate("/")
    }

    return (
        <nav>
            <Link to={"/user/" + auth?.currentUser?.uid} class="flex flex-logo"><img src='/lotus.png'alt='logo' width='40px'/> <h1>LazyMind</h1></Link>
            {UserActive ?
                <div className='profile' >
                    <img src={auth?.currentUser.photoURL != null ? auth.currentUser.photoURL : '/images/propic.webp'} onClick={()=>setMenu(!menu)} alt='user-profile' />
                    
                    <div className={menu ? 'clicked' : 'not-clicked'}>
                        <ul>
                            <li className="flex">
                            <img src={auth.currentUser.photoURL != null ? auth.currentUser.photoURL : '/images/propic.webp'} onClick={()=>setMenu(!menu)} alt='user-profile' />
                                <p onClick={()=>setMenu(!menu)}>{auth.currentUser.displayName != null ? auth.currentUser.displayName : auth.currentUser.email.split('@')[0]}</p></li>
                            <hr />
                            <li><i className="fa fa-user" aria-hidden="true"></i> My Profile</li>
                            <li onClick={logOut} ><i className="fa fa-sign-out" aria-hidden="true"></i> Log Out</li>
                        </ul>
                    </div>
                </div>

                : <Link to="/"><h1>login</h1></Link>}
        </nav>
    )
}

export default Navbar
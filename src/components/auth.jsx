import { useState,useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { auth, googleProvider } from "../firebase-config"
import { createUserWithEmailAndPassword, signInWithPopup, signOut,signInWithEmailAndPassword } from "firebase/auth"
import { redirect } from "react-router-dom"

export const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [variant,setVariant] = useState('login')

    const toggleVariant = useCallback(
      () => {
        setVariant((currentVariant)=>currentVariant === 'login' ? 'register' : 'login')
        setError(false)
      },
      [],
    )
    

    const navigate = useNavigate()
    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (error) {
            setError(true)
            console.error(error)
        }
        navigate("/user/" + auth.currentUser.uid)
    }

    const logIn = async () =>{
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.error(error)
        }
        navigate("/user/" + auth.currentUser.uid)
    }

    const signInwithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)


        } catch (error) {
            console.error(error)
        }
        navigate("/user/" + auth.currentUser.uid)
    }

    const logOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error(error)
        }

    }

    return (
        <div className="auth">
            
            <div className="auth-inner" style={{paddingBottom:"1.2rem",paddingTop:"1.2rem"}}>
            <div className="flex flex-logo">
                <img src="/lotus.png" alt="logo" width='100px'/>
                <div>
                <h1 style={{marginBottom:'0px'}}>LazyMind</h1>
                <p style={{margin:'0px',color:'black'}}>The Meditation App</p>
                </div>
                
                </div>
                
            <input className="auth-item email" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
            <input className="auth-item" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button onClick={variant === 'login'? ()=>{logIn()} : ()=>{signIn()}} className="auth-item" >{variant === 'login' ? "Log In" : "Register"}</button>
            <p>{variant === 'login'? 'New to LazyMind?' : 'Already a user?'} <span onClick={(toggleVariant)}>{variant === 'login' ? "Create new account" : "Login"}</span></p>
            {error && <p style={{color:'red'}}>Email already in use!</p>}
            <button onClick={signInwithGoogle} className="auth-item google"><i className="fa-brands fa-google"></i>  Sign In With Google</button>
            </div>
            
        </div>
    )

}
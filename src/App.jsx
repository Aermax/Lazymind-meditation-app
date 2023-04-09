import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Session from "./components/Session"

import Navbar from "./components/Navbar"
import { Auth } from "./components/auth"



function App() {


  return (

    <BrowserRouter>

      <Routes>
        <Route path="*" element={<Navbar />} />
        <Route path="/" element={<Auth />} />
        <Route path="/user/:userid" element={<Home />} />
        <Route path="/session/:id" element={<Session />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App

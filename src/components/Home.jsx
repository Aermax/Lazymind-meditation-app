import React from 'react'
import Navbar from "./Navbar"
import Feed from "./Feed"

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="feed">
            <Feed />
            </div>
          

        </div>
    )
}

export default Home
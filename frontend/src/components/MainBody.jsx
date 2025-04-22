import React, { useState } from 'react'
import Video from './Video';

function MainBody({sidebar}) {
    const [videos , setVideos] = useState([]);

    const fetchVideos = async ()=>{
        const url = 'http://localhost:8080/api/v1/videos';
        const response = await fetch(url , {
            method: 'get',
            headers :{
                'Content-Type' : 'application/json',
            },
        })
        const data = await response.json();
        setVideos(data);
    }
  return (
    <div className='d-flex flex-row'>
      <div style={
        {
            height: '100vh',
            width: '280px',
            backgroundColor: 'red',
            display: sidebar? '': 'none'
        }
      }>

      </div>
      <div>
        {videos.length === 0? "No data found": videos.map((video)=>{
            return <Video video={video}/>
        })}
      </div>
    </div>
  )
}

export default MainBody

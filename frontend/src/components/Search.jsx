import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Video from './Video';
import { VideoContext } from '../context/VideoContext';

function Search({sidebar}) {
    const {videos} = useContext(VideoContext);

    const navigate = useNavigate();
    useEffect(()=>{
      if(!videos || videos.length===0){
        navigate("/");
      }
    } , [videos]);

  return (
    <div className='d-flex'>
      <div style={
        {
          height: '100vh',
          width: '280px',
          backgroundColor: 'red',
          display: sidebar ? '' : 'none'
        }
      }>

      </div>
      <div className='flex-grow-1'>
        <div className='container mt-3'>
          <div className='row'>
            {videos.length === 0 ? "No data found" : videos.map((video) => {
              return <Video key={video._id} video={video} />;
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search

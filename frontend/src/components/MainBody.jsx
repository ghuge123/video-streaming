import React, { useState, useEffect, useContext } from 'react'
import Video from './Video';
import { VideoContext } from '../context/VideoContext';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

function MainBody({ sidebar }) {
  const { videos, fetchVideos } = useContext(VideoContext);
  useEffect(() => {
    fetchVideos();
  }, [])

  return (
    <div className='d-flex'>
      <div className='p-4' style={
        {
          height: '100vh',
          width: '280px',
          backgroundColor: 'red',
          display: sidebar ? '' : 'none',
        }
      }>
        <div className='d-flex align-items-center'>
          <Link to='/' style={{textDecoration: 'none' , color: 'white'}}><HomeIcon className='fs-3'></HomeIcon></Link>
          <Link to='/' className='mx-4' style={{textDecoration: 'none' , color: 'white'}}>Home</Link>
        </div>
        <div className='d-flex align-items-center mt-3'>
          <Link to='/subscriptions' style={{textDecoration: 'none' , color: 'white'}}><SubscriptionsIcon className='fs-3'></SubscriptionsIcon></Link>
          <Link to='/subscriptions' className='mx-4' style={{textDecoration: 'none' , color: 'white'}}>Subscriptions</Link>
        </div>

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

export default MainBody

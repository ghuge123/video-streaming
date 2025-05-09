import React, { useState, useEffect, useContext } from 'react'
import Video from './Video';
import { VideoContext } from '../context/VideoContext';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation } from 'react-router-dom';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import HistoryIcon from '@mui/icons-material/History';
import '../styles/sidebar.css';

function MainBody({ sidebar }) {
  const { videos, fetchVideos } = useContext(VideoContext);

  const location = useLocation();

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
        <div className={`d-flex align-items-center px-3 sidebar-item ${location.pathname=='/'? 'active':''}`} style={{height:'50px' , width:'230px'}}>
          <Link to='/' style={{textDecoration: 'none' , color: 'white'}}><HomeIcon className='fs-3'></HomeIcon></Link>
          <Link to='/' className='mx-4' style={{textDecoration: 'none' , color: 'white'}}>Home</Link>
        </div>
        <div className={`d-flex align-items-center mt-2 px-3 sidebar-item ${location.pathname=='/subscriptions'? 'active':''}`} style={{height:'50px' , width:'230px'}}>
          <Link to='/subscriptions' state={{ type: 'subscriptions' }} style={{textDecoration: 'none' , color: 'white'}}><SubscriptionsIcon className='fs-3'></SubscriptionsIcon></Link>
          <Link to='/subscriptions' state={{ type: 'subscriptions' }} className='mx-4' style={{textDecoration: 'none' , color: 'white'}}>Subscriptions</Link>
        </div>
        <div className={`d-flex align-items-center mt-2 px-3 sidebar-item ${location.pathname=='/liked'? 'active':''}`} style={{height:'50px' , width:'230px'}}>
          <Link to='/liked' state={{ type: 'liked' }} style={{textDecoration: 'none' , color: 'white'}}><ThumbUpOffAltIcon className='fs-3'></ThumbUpOffAltIcon></Link>
          <Link to='/liked' state={{ type: 'liked' }} className='mx-4' style={{textDecoration: 'none' , color: 'white'}}>Liked videos</Link>
        </div>
        <div className={`d-flex align-items-center mt-2 px-3 sidebar-item ${location.pathname=='/yourVideos'? 'active':''}`} style={{height:'50px' , width:'230px'}}>
          <Link to='/yourVideos' state={{ type: 'yourVideos' }} style={{textDecoration: 'none' , color: 'white'}}><SmartDisplayIcon className='fs-3'></SmartDisplayIcon></Link>
          <Link to='/yourVideos' state={{ type: 'yourVideos' }} className='mx-4' style={{textDecoration: 'none' , color: 'white'}}>Your videos</Link>
        </div>
        <div className={`d-flex align-items-center mt-2 px-3 sidebar-item ${location.pathname=='/playlists'? 'active':''}`} style={{height:'50px' , width:'230px'}}>
          <Link to='/playlists' state={{ type: 'playlists' }} style={{textDecoration: 'none' , color: 'white'}}><PlaylistPlayIcon className='fs-3'></PlaylistPlayIcon></Link>
          <Link to='/playlists' state={{ type: 'playlists' }} className='mx-4' style={{textDecoration: 'none' , color: 'white'}}>Playlists</Link>
        </div>
        <div className={`d-flex align-items-center mt-2 px-3 sidebar-item ${location.pathname=='/history'? 'active':''}`} style={{height:'50px' , width:'230px'}}>
          <Link to='/history' state={{ type: 'history' }} style={{textDecoration: 'none' , color: 'white'}}><HistoryIcon className='fs-3'></HistoryIcon></Link>
          <Link to='/history' state={{ type: 'history' }} className='mx-4' style={{textDecoration: 'none' , color: 'white'}}>History</Link>
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

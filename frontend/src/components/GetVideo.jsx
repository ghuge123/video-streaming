import React, { useContext, useEffect, useState } from 'react'
import {  Link, useLocation, useNavigate } from 'react-router-dom'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { UserContext } from '../context/userContext';
import { SubscribeContext } from '../context/SubscribeContext';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { LikeContext } from '../context/LikeContext';
import { CommentsContext } from '../context/CommentsContext';
import Comment from './Comment';


function GetVideo({ sidebar, showAlert }) {
  sidebar = !sidebar
  const { user, isLogout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const video = location.state?.video;
  const owner = video.owner;

  const { getSubscriber, toggleSubscribe , subscribe , setSubscribe , totalSubscribers , setTotalSubscribers } = useContext(SubscribeContext);
  const { likedVideos, toggleLikeButton, totalLikes } = useContext(LikeContext);
  const { addComment, fetchComments, comment, setComment} = useContext(CommentsContext);


  const [like, setLike] = useState(false);
  const [unlike, setUnlike] = useState(false);
  const [totalLike, setTotalLike] = useState(0);
  const [content, setContent] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      const result = await getSubscriber(owner._id, user?._id);
      setTotalSubscribers(result.totalSubscribers);
      setSubscribe(result.isSubscribed || false);

      const total = await totalLikes(owner._id);
      setTotalLike(total);

      const res = await fetchComments(video._id);
      setComment(res);

      if (user) {
        const isLike = await likedVideos(owner._id); // assuming like is on the video
        setLike(isLike);
      } else {
        // Reset state on logout
        setLike(false);
        setUnlike(false);
      }

    };

    fetchData();
  }, [user , owner._id, video._id]);


  const toggleLike = async () => {
    if (user) {
      const res = await toggleLikeButton(owner._id);
      const total = await totalLikes(owner._id);
      setLike(res);
      setTotalLike(total);
      setUnlike(false);
    } else {
      navigate('/login', { state: { from: location } });
    }
  }

  const toggleUnlike = async () => {
    if (user) {
      if (like) {
        const res = await toggleLikeButton(owner._id);
        const total = await totalLikes(owner._id);
        setLike(res);
        setTotalLike(total);
      }
      setUnlike(!unlike);

    } else {
      navigate('/login', { state: { from: location } });
    }
  }

  const isSubscribe = async () => {
    if (user) {
      let data = await toggleSubscribe(owner._id);
      const result = await getSubscriber(owner._id, user._id);
      setTotalSubscribers(result.totalSubscribers);
      if (subscribe) {
        if (data.success) {
          setSubscribe(false);
          showAlert("Unsubscribe successfully", "success");
        } else {
          showAlert(data.message, "danger");
        }
      } else {
        if (data.success) {
          setSubscribe(true);
          showAlert("Subscribe successfully", "success");
        } else {
          showAlert(data.message, "danger");
        }
      }

    } else {
      navigate('/login', { state: { from: location } });
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const filter = {};
    filter.content = content;
    const res = await addComment(video._id, filter);
    if (res.success) {
      showAlert('Comment added Successfully', 'success');
      const result = await fetchComments(video._id);
      setComment(result);
      setContent("");
    } else {
      showAlert(res.message, 'danger');
    }
  }

  const handleOnChange = (e) => {
    setContent(e.target.value);
  }

  


  // If no video was passed (like direct visit), redirect or show message
  return (
    <div >
      <div style={{
        height: '100vh',
        width: '280px',
        backgroundColor: 'red',
        display: sidebar ? '' : 'none',
        zIndex: '1',
        position: "absolute",
        marginTop: 'none'
      }}></div>
      <div style={{ marginLeft: '26px' }}>
        <video controls style={{ height: '460px', width: '900px' }} className="mt-3">
          <source src={video.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h3>{video.description}</h3>
        <div className='d-flex mt-3 ' style={{ width: '100px' }}>
          <Link to='/channel' state={{ owner}} style={{ textDecoration: 'none', color: 'black' , marginTop: '8px' }}>
            {video.owner.avatar ? <img style={{ height: '44px', width: '44px', borderRadius: "50%", marginRight: '4px' }} src={video.owner.avatar}></img> : <div style={{ height: '44px', width: '44px', marginRight: '4px', borderRadius: "50%", paddingTop: '2px', backgroundColor: "red", textAlign: "center" }}><p style={{ marginTop: '5px' }} className='fw-semibold'>{video.owner.username.charAt(0).toUpperCase()}</p></div>}
          </Link>
          <div className='mx-2'>
            <Link to='/channel' state={{ owner}} className='fs-5' style={{ textDecoration: 'none', color: 'black' }}>
              {video.owner.username}<br></br>
            </Link>
            <small style={{color: 'rgb(111, 113, 114)'}}>{totalSubscribers}&nbsp;subscribers</small>
          </div>
          {subscribe ? <button className='btn btn-success mx-3 rounded-5 px-4' onClick={isSubscribe} style={{ paddingTop: '0px', paddingBottom: '0px', height: '40px' }}>Unsubscribe</button> :
            <button className='btn btn-success mx-3 rounded-5 px-4' onClick={isSubscribe} style={{ paddingTop: '0px', paddingBottom: '0px', height: '40px' }}>Subscribe</button>
          }
          <div className='d-flex justify-content-end align-items-center border rounded-5' style={{ height: '40px', width: '200px', backgroundColor: 'red' }}>
            {like ? <ThumbUpIcon className='mx-3' onClick={toggleLike} style={{ cursor: 'pointer' }}></ThumbUpIcon> :
              <ThumbUpOffAltIcon className='mx-3' onClick={toggleLike} style={{ cursor: 'pointer' }} />
            }
            <p className='border-end mt-3' style={{ paddingRight: '8px' }}>{totalLike}</p>
            {unlike ? <ThumbDownAltIcon className='mx-3' onClick={toggleUnlike} style={{ cursor: 'pointer' }} /> :
              <ThumbDownOffAltIcon className='mx-3' onClick={toggleUnlike} style={{ cursor: 'pointer' }}></ThumbDownOffAltIcon>
            }
          </div>
        </div>
        <div className='d-flex flex-column mt-3'>
          <h4>{comment.length} Comments</h4>
          {user ? <div className='mt-2 d-flex'>
            {user?.avatar ? <img style={{ height: '40px', width: '40px', borderRadius: "50%", marginRight: '4px' }} src={user.avatar}></img> : <div style={{ height: '40px', width: '40px', marginRight: '4px', borderRadius: "50%", paddingTop: '2px', backgroundColor: "red", textAlign: "center" }}><p style={{ marginTop: '5px' }} className='fw-semibold'>{user?.username.charAt(0).toUpperCase()}</p></div>}
            <form onSubmit={handleSubmit}>
              <input type='text' className='border-bottom' placeholder='Add a comment...' name='comment' value={content} onChange={handleOnChange} style={{ border: 'none', width: '860px', marginLeft: '4px' }}></input><br></br>
              <button className='btn btn-success mt-2' disabled={content.trim() === ""} style={{ marginLeft: '734px' }}>Add Comment</button>
            </form>
          </div> : ""}
          <div>
            {comment.length === 0 ? <p>No Comments!</p> :
              comment.map((ele) => {
                return <Comment key={ele._id} ele={ele}></Comment>
              })
            }
          </div>
        </div>

      </div>
    </div>
  );
}

export default GetVideo

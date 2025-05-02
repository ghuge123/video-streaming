import React, { useContext, useEffect , useState} from 'react'
import { UserContext } from '../context/userContext';
import { useLocation, useNavigate , Link } from 'react-router-dom';
import { CommentsContext } from '../context/CommentsContext';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

function Comment({ele}) {
    const owner = ele.owner;

    const navigate = useNavigate();
    const location = useLocation();

    const [commentLike , setCommentLike] = useState(false);
    const [commentUnlike , setCommentUnlike] = useState(false);
    const [totalComments , setTotalComments] = useState(0);

    const {user} = useContext(UserContext);
    const {getLikedComments , toggleCommentLike , getCommentsLikes} = useContext(CommentsContext);

    useEffect(()=>{
        const fetchData = async () =>{
            if(user){
                const data = await getLikedComments(ele._id);
                setCommentLike(data);
            }else{
                setCommentLike(false);
                setCommentUnlike(false);
            }
            const res = await getCommentsLikes(ele._id);
            setTotalComments(res);
        }
        fetchData();
    } , [ele._id]);

    const getToggleCommentLike = async () => {
        if(user){
            const res = await toggleCommentLike(ele._id);
            const total = await getCommentsLikes(ele._id);
            setTotalComments(total);
            setCommentLike(res);
            setCommentUnlike(false);
        }else{
            navigate('/login' , {state : {from : location}})
        }
    }

    const getToggleCommentUnlike = async () =>{
        if(user){
            if(commentLike){
                const res = await toggleCommentLike(ele._id);
                const total = await getCommentsLikes(ele._id);
                setTotalComments(total);
                setCommentLike(res);
            }
            setCommentUnlike(!commentUnlike);    
        }
    }

    const getTimeAgo = (createdTime) => {
        const now = new Date();
        const past = new Date(createdTime);
        const diff = now - past;
    
        const sec = Math.floor(diff / 1000);
        if (sec < 60) return `${sec} seconds ago`;
    
        const min = Math.floor(sec / 60);
        if (min < 60) return `${min} minutes ago`;
    
        const hour = Math.floor(min / 60);
        if (hour < 24) return `${hour} hour ago`;
    
        const day = Math.floor(hour / 24);
        return `${day} day ago`;
      }

    return (
        <div key={ele._id} className='d-flex mt-2'>
          <Link to='/channel' state={{ owner}} style={{ textDecoration: 'none', color: 'black' }}>
            {ele.owner?.avatar ? <img style={{ height: '40px', width: '40px', borderRadius: "50%", marginRight: '4px' }} src={ele.owner.avatar}></img> : <div style={{ height: '40px', width: '40px', marginRight: '4px', borderRadius: "50%", paddingTop: '2px', backgroundColor: "red", textAlign: "center" }}><p style={{ marginTop: '5px' }} className='fw-semibold'>{ele.owner?.username.charAt(0).toUpperCase()}</p></div>}
          </Link>
          <div className='mx-2'>
            <p>@{ele.owner?.username} <small style={{ color: 'gray' }}>{getTimeAgo(ele.updatedAt)}</small><br></br>
              {ele.content}
            </p>
            <div className='d-flex '>
              {commentLike ? <ThumbUpIcon className='mx-2' onClick={getToggleCommentLike} style={{ cursor: 'pointer' }}></ThumbUpIcon> :
                <ThumbUpOffAltIcon className='mx-2' onClick={getToggleCommentLike} style={{ cursor: 'pointer' }} />
              }
              <p className='' style={{ paddingRight: '8px' }}>{totalComments}</p>
              {commentUnlike ? <ThumbDownAltIcon className='mx-3' onClick={getToggleCommentUnlike} style={{ cursor: 'pointer' }} /> :
                <ThumbDownOffAltIcon className='mx-3' onClick={getToggleCommentUnlike} style={{ cursor: 'pointer' }}></ThumbDownOffAltIcon>
              }
            </div>
          </div>
        </div>
      )
}

export default Comment

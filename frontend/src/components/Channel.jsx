import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext';
import { SubscribeContext } from '../context/SubscribeContext';

function Channel({sidebar , showAlert}) {
    const location = useLocation();
    const owner = location.state?.owner;

    const navigate = useNavigate();

    const {user} = useContext(UserContext);
    const {toggleSubscribe , subscribe , setSubscribe , totalSubscribers , setTotalSubscribers , getSubscriber} = useContext(SubscribeContext);

    useEffect(()=>{
      const fetchData = async ()=>{
        const res = await getSubscriber(owner._id , user?._id);
        setTotalSubscribers(res.totalSubscribers);
      }

      fetchData();
    } , [])

    const handleOnClick = async() => {
      if(user){
        const res = await toggleSubscribe(owner._id);
        const result = await getSubscriber(owner._id, user._id);
        setTotalSubscribers(result.totalSubscribers);
        if (subscribe) {
          if (res.success) {
            setSubscribe(false);
            showAlert("Unsubscribe successfully", "success");
          } else {
            showAlert(res.message, "danger");
          }
        } else {
          if (res.success) {
            setSubscribe(true);
            showAlert("Subscribe successfully", "success");
          } else {
            showAlert(res.message, "danger");
          }
        }
      }else{
        navigate('/login');
      }

    }

  return (
    <div className='d-flex '>
      <div style={{
        height: '100vh',
        width: '280px',
        backgroundColor: 'red',
        display: sidebar? '': 'none'
      }}>

      </div>
        <div className='m-5'>
            <img src={owner.coverImage} className='rounded-3' style={{width:'1000px' , height: '200px'}}></img>
            <div className='d-flex mt-4'>
                {owner.avatar ? <img style={{ height: '200px', width: '200px', borderRadius: "50%", marginRight: '4px' }} src={owner.avatar}></img> : 
                <div style={{ height: '200px', width: '200px', marginRight: '4px', borderRadius: "50%", paddingTop: '2px', backgroundColor: "red", textAlign: "center" }}><p style={{ marginTop: '66px' }} className='fw-bold fs-1'>{owner.username.charAt(0).toUpperCase()}</p></div>
                }
                <div className='mx-5'>
                    <h2>{owner.username}</h2>
                    <small>{totalSubscribers} subscribers</small>
                    <p>Welcome to "{owner.username}" YouTube Channel. </p>
                    {subscribe? <button className='btn btn-success' onClick={handleOnClick}>Unsubscribe</button> : 
                      <button className='btn btn-success' onClick={handleOnClick}>Subscribe</button>
                    }
                </div>
            </div>
        </div>
      </div>
  )
}

export default Channel

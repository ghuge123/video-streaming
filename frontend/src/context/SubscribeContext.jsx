import React, { createContext, useState } from 'react'

export const SubscribeContext = createContext();

export const SubscribeProvider = ({children})=>{

    const [subscribe, setSubscribe] = useState(false);
    const [totalSubscribers , setTotalSubscribers] = useState(0);

    const getSubscriber = async (channelId, userId) => {
        try {
          const res = await fetch(`http://localhost:8080/api/v1/subscribers/${channelId}`, {
            method: "GET"
          });
      
          const data = await res.json();
      
          // Check if user is in the list of subscribers
          let isSubscribed = false;
          if(userId){
             isSubscribed = data.subscribers.some(sub => sub.subscriber === userId);
          }
          const filter = {};
          filter.isSubscribed = isSubscribed;
          filter.totalSubscribers = data.totalSubscribers;
          return filter;
        } catch (err) {
          console.error("Error in getSubscriber:", err);
          const filter = {};
          filter.isSubscribed = false;
          filter.totalSubscribers = 0;
          return filter;
        }
      };
      

    const toggleSubscribe = async (channel)=>{
        let url = `http://localhost:8080/api/v1/subscribers/${channel}`;

        const response = await fetch(url , {
            method: 'put',
            credentials: 'include' , 
        })
        let data = await response.json();
        return data;
    }
    return(
        <SubscribeContext.Provider value={{getSubscriber , toggleSubscribe , subscribe , setSubscribe , totalSubscribers , setTotalSubscribers}}>
            {children}
        </SubscribeContext.Provider>
    )
}

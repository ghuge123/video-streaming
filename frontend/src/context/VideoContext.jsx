import { createContext, useState } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({children})=>{

    const [videos , setVideos] = useState([]);

    const addVideo = async (formData)=>{
        const url = 'http://localhost:8080/api/v1/videos'
        const response = await fetch(url , {
            method: 'post',
            credentials: 'include',
            body: formData
        });
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server did not return JSON");
        }

        const data = await response.json();
        if(data.success){
            setVideos(videos.concat(data.video));
            return data;
        }else{
            console("error")
        }
    }

    const fetchVideos = async ()=>{
            const url = 'http://localhost:8080/api/v1/videos';
            const response = await fetch(url , {
                method: 'get',
                credentials: 'include'
            })
            const data = await response.json();
            if(data.videos){
              setVideos(data.videos);
            }
            
        }
        
    return(
        <VideoContext.Provider value={{videos , setVideos , addVideo , fetchVideos}}>
            {children}
        </VideoContext.Provider>
    )
}
import { createContext, useState } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({children})=>{

    const [videos , setVideos] = useState([]);

    const url = 'http://localhost:8080/api/v1/videos'

    const addVideo = async (formData)=>{
        console.log(formData);
        const response = await fetch(url , {
            method: 'post',
            credentials: 'include',
            body: formData
        });
        const data = await response.json();
        if(data.success){
            setVideos(videos.concat(data.video));
        }else{
            console("error")
        }
    }
    return(
        <VideoContext.Provider value={{videos , setVideos , addVideo}}>
            {children}
        </VideoContext.Provider>
    )
}
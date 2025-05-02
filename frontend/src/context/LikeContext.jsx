import { createContext } from "react";

export const LikeContext = createContext();

export const LikeProvider = ({children})=>{
    const likedVideos = async (video)=>{
       try {
         const url = 'http://localhost:8080/api/v1/likes/videos';
         const response = await fetch(url , {
             method: 'get',
             credentials: 'include'
         });
 
         const data = await response.json();
         return data.likedVideos.some(ele => ele.video === video);
       } catch (error) {
        console.log("error" , error);
        return false;
       }
    }

    const toggleLikeButton = async (video)=>{
        try {
            const url = `http://localhost:8080/api/v1/likes/toggle/v/${video}`;
            const response = await fetch(url , {
                method: 'post',
                credentials: 'include'
            });

            const data = await response.json();
            return data.liked;
        } catch (error) {
            return false;
        }
    }

    const totalLikes = async (video)=>{
        const url = `http://localhost:8080/api/v1/likes/count/${video}`;
        const response = await fetch(url , {
            method: 'get',
        });

        const data = await response.json();
        return data.totalLikes;
    }

    return(
        <LikeContext.Provider value={{likedVideos , toggleLikeButton , totalLikes}}>
            {children}
        </LikeContext.Provider>
    )
}
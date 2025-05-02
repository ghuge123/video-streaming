import { createContext, useState } from "react";

export const CommentsContext = createContext();

export const CommentsProvider = ({children}) => {

    const [comment , setComment] = useState([]);

    const addComment = async (videoId , filter) =>{
        const url = `http://localhost:8080/api/v1/comments/${videoId}`;
        console.log(filter);
        const response = await fetch(url , {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filter)
        })
        const data = await response.json();
        return data;
    }

    const fetchComments = async (videoId) =>{
        const url = `http://localhost:8080/api/v1/comments/${videoId}`;

        const response = await fetch(url , {
            method: 'get',
        });

        const data = await response.json();
        return data.comments.docs;
    }

    const getLikedComments = async (commentId) =>{
        const url = `http://localhost:8080/api/v1/likes/comments`;

        try {
            const response = await fetch(url , {
                method: 'get',
                credentials: 'include'
            });
    
            const data = await response.json();
            return data.likedComments.some(ele => ele.comment === commentId);
        } catch (error) {
            return false;
        }
    }

    const toggleCommentLike = async (commentId)=>{
        const url = `http://localhost:8080/api/v1/likes/toggle/c/${commentId}`;

        const response = await fetch(url , {
            method: 'post',
            credentials: 'include'
        });
        const data = await response.json();
        return data.liked;
    }

    const getCommentsLikes = async (commentId) => {
        const url =  `http://localhost:8080/api/v1/likes/comments/${commentId}`;

        const response = await fetch(url , {
            method: 'get'
        });

        const data = await response.json();
        console.log(data.totalComments);
        return data.totalComments;
    }
    return (
        <CommentsContext.Provider value={{addComment , fetchComments , comment , setComment , getLikedComments , toggleCommentLike , getCommentsLikes}}>
            {children}
        </CommentsContext.Provider>
    )
}
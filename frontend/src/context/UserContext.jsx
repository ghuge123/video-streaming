import { createContext , useState , useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({children})=>{
    const [user , setUser] = useState(null);

    const [isLogout , setIsLogout] = useState(false);
    const [loading, setLoading] = useState(true);

    const url = 'http://localhost:8080/api/v1/user/current-user';

    const fetchData = async ()=>{
        try {
            const response = await fetch(url , {
                method: 'get',
                credentials: 'include'
            });
            const data = await response.json();
    
            if(data.success){
                setUser(data.user);
            }else{
                await refreshToken();
            }
        } catch (error) {
            console.log("Error:", error);
            setUser(false);
        }finally {
            setLoading(false);
        }
    }

    const refreshToken = async () =>{
        const url = 'http://localhost:8080/api/v1/user/refresh-token';
        const response = await fetch(url , {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        if(data.success){
            fetchData();
        }
    }

    useEffect(()=>{
        fetchData();
    } , []);

    return(
        <UserContext.Provider value={{user , setUser , fetchData , setIsLogout , isLogout , loading}}>
            {children}
        </UserContext.Provider>
    )
}
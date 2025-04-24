import { createContext , useState , useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({children})=>{
    const [user , setUser] = useState(null);

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
                setUser(null);
            }
        } catch (error) {
            console.log("Error:", err);
        }
    }

    useEffect(()=>{
        fetchData();
    } , []);

    return(
        <UserContext.Provider value={{user , setUser , fetchData}}>
            {children}
        </UserContext.Provider>
    )
}
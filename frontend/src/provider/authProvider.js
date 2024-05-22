// import axios from 'axios';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';

//creates an empty context object that will be used to share the authentication on state
const AuthContext = createContext();

//component serves as the provider for the authentication context
const AuthProvider = ({children})=>{

    const [token,setToken_] = useState(localStorage.getItem("token"));

    const setToken = (newToken)=>{
        setToken_(newToken);
    }

    useEffect(()=>{
        if(token){
            localStorage.setItem('token',token)
        }else{
            localStorage.removeItem('token');
        }
    },[token])

    const contextValue = useMemo(()=>({
        token,
        setToken,
    }),
    [token]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    )
}

export const useAuth=()=>{
    return useContext(AuthContext);
}
export default AuthProvider;

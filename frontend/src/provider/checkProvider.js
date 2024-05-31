import React, {createContext,useState} from 'react';

const BooleanContext = createContext();

export const BooleanProvider = ({children})=>{
    const [checkReload,setCheckReload] = useState(false);
    return (
        <BooleanContext.Provider value={{checkReload,setCheckReload}}>
            {children}
        </BooleanContext.Provider>
    );
}

export default BooleanContext;
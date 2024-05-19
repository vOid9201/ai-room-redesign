import {  Route,Navigate,Routes } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import useToken from './auth/useToken';
import Page404 from './pages/Page404';

import Dashboard from './Components/Dashboard';
import ImageContainer from './Components/ImageContainer';
import { useEffect, useState } from 'react';
import ProtectedRoute from './Components/ProtectedRoute';


function App() {

  const { token, setToken } = useToken();
  const [decodedToken, setDecodedToken] = useState()
  
  useEffect(() => {
    setDecodedToken(decodeToken(token));
  }, [token]);

  return (
      <Routes>
        <Route path="/*" element={ 
          <ProtectedRoute>
          {decodedToken ? (
            <Routes>
              <Route path="/" element={<Dashboard fullName={decodedToken.user.fullName} />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          ) : (
            <Navigate to="/signin" replace />
          )}
        </ProtectedRoute>
        }/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/signin" element={<SignIn setToken={setToken}/>}/>
        <Route path="/folders/:folderId" element={<ImageContainer/>}/>
        <Route path="/404" element={<Page404/>}/>
        {/* <Route path="*" element={<Navigate to="/404" replace />} /> */}

      </Routes>
  )
}

export default App;




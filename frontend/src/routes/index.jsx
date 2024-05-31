import { RouterProvider,createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import SignUp from '../pages/SignUp';
import SingIn from '../pages/SignIn';
import Home from "../Components/Home";
import ImageContainer from "../Components/ImageContainer";
import ImageViewer from "../Components/ImageViewer";
import { BooleanProvider } from "../provider/checkProvider";

const Routes = ()=>{
    const {token} = useAuth;
    const routesForPublic = [
        {
            path : "/signup",
            element : <SignUp/>
        }
    ]

    const routesForAuthenticatedOnly = [
        {
            path:"/",
            element:<ProtectedRoute/>,
            children:[
                {
                    path:"/",
                    element:<Home/>,
                    
                },{
                    path:"/folders/:folderId",
                    element:<BooleanProvider><ImageContainer/></BooleanProvider>,
                },{
                    path:"/images/:imageId/:folderId",
                    element:<BooleanProvider><ImageViewer/></BooleanProvider>
                }
            ]
        }
    ]

    const routesForNotAuthenticatedOnly = [
        {
            path:"/login",
            element:<SingIn/>
        }
    ]

    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly:[]),
        ...routesForAuthenticatedOnly,
    ])

    return <RouterProvider router={router}/>
}

export default Routes;
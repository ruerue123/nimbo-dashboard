import { useEffect, useState } from "react";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { useDispatch } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

function App() {

    const dispatch = useDispatch()

    const [allRoutes, setAllRoutes] = useState([...publicRoutes])

    useEffect(() => {
        const routes = getRoutes()
        setAllRoutes([...allRoutes, routes])
    }, [])

    // Try to rehydrate session on mount via the HttpOnly cookie. If the user
    // has no cookie the request 401s and authChecked flips so ProtectRoute
    // can redirect to login.
    useEffect(() => {
        dispatch(get_user_info())
    }, [dispatch])


    return <Router allRoutes={allRoutes} />
}

export default App;

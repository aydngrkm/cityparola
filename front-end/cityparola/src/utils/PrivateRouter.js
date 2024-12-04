import { Route, Navigate } from "react-router-dom";

const PrivateRouter = ({ children, ...rest }) => {
    const authenticated = false;

    return authenticated ? children : <Navigate to="/sign-in" replace />;
};

export default PrivateRouter;

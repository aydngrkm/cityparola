import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRouter = ({ children }) => {
  const { authTokens } = useContext(AuthContext);

  if (!authTokens || Object.keys(authTokens).length === 0) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default PrivateRouter;

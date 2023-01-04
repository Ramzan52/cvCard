import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'react-color-palette/lib/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import Login from './screens/Login';
import Home from './screens/Home';
import Sidebar from './components/Sidebar';
import Employees from './screens/Employees';
import Invitations from './screens/Invitations';
import Settings from './screens/Settings';
import EditCard from './screens/EditCard';
import { useAuth } from './components/Context';
import authSvc from './services/auth-service';
import spinnerSvc from './services/spinner-service';
import LoaderSpinner from './components/LoaderSpinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'simplebar/dist/simplebar.min.css';
import ForgetPassword from './screens/ForgetPassword';
import ChangePassword from './screens/ChangePassword';

function App() {
  const navigate = useNavigate();
  const currentRoute = window.location.pathname;
  const { forceLogout, setForceLogout } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const logout = () => {
    setForceLogout(false);
    localStorage.clear();
  };

  useEffect(() => {
    if (token === null || forceLogout) {
      logout();
    }
  }, [forceLogout, token]);

  useEffect(() => {
    localStorage.removeItem('user');

    const validateLoggedInStatus = async () => {
      const token = localStorage.getItem('idToken');
      if (token) {
        const { isLoggedIn, token } = await authSvc.validate();
        setToken(token);
        navigate({ currentroute: currentRoute });
      }
    };
    validateLoggedInStatus();

    const subscription = spinnerSvc.requestInProgress.subscribe((isLoading) => setIsLoading(isLoading));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <ToastContainer hideProgressBar={true} />
      {isLoading && <LoaderSpinner />}
      {localStorage.getItem('idToken') !== null ? (
        <>
          <Sidebar />
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/employees" element={<Employees />}></Route>
            <Route path="/invitations" element={<Invitations />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/change-password" element={<ChangePassword />}></Route>
            <Route path="/edit/:id" element={<EditCard />}></Route>
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/forget-password" element={<ForgetPassword />}></Route>
          <Route exact path="/" element={<Navigate to={'/sign-in'} />}></Route>
          <Route exact path="*" element={<Navigate to={'/sign-in'} />}></Route>
          <Route path="/sign-in" element={<Login onLogin={() => {}} />}></Route>

          {/* <Route path="/forget-password" element={<ForgetPassword />}></Route> */}
        </Routes>
      )}
    </>
  );
}

export default App;

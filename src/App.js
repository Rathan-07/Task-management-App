import { useEffect } from 'react';
import Home from './components/Home';
import { Link, Route, Routes } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import { useAuth } from './components/context/AuthContext';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import Account from './components/Account';
import TaskItem from './components/DashBoard/TaskItem';
import PrivateRoute from './components/PrivateRoutes';
import Unauthorized from './components/Unauthorized';
import TaskDetail from './components/DashBoard/TaskList';
function App() {
  const { user, dispatch } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const response = await axios.get('http://localhost:3070/users/account', {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          });
          dispatch({ type: "LOGIN", payload: response.data });
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch({ type: "LOGOUT" });
        }
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <div className="App">
      <h1>Task Management App</h1>
      <Link to="/">Home</Link> |
      {!user.isLoggedIn ? (
        <>
          <Link to="/register">Register</Link> |
          <Link to="/login">Login</Link> |
        </>
      ) : (
        <>
          <Link to="/account">Account</Link> |
          <Link to="/dashboard">DashBoard</Link> |
          <Link to = "/taskItem">TaskItem</Link> |
          <Link to="/" onClick={() => {
            localStorage.removeItem('token');
            dispatch({ type: "LOGOUT" });
          }}>Logout</Link>
        </>
      )}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/account' element={
          <PrivateRoute permittedRoles={['user']}>
            <Account />
          </PrivateRoute>
        } />
        <Route path='/dashboard' element={
          <PrivateRoute permittedRoles={['user']}>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path='/dashboard/TaskItem/:id' element={
          <PrivateRoute permittedRoles={['user']}>
            <TaskItem />
          </PrivateRoute>
        } />
      <Route path='/taskItem' element = {<TaskItem/>}/>
      <Route path='/unauthorized' element = {<Unauthorized/>}/>
      <Route path="/dashboard/TaskList/:taskId" element={<TaskDetail />} />
      </Routes>

    </div>
  );
}

export default App;

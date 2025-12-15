import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Subjects from './components/Subjects/Subjects.jsx'
import Achievements from './components/Achievements/Achievements.jsx'
import Assignments from './components/Assignments/Assignments.jsx'
import Community from './components/Community/community.jsx'
import Chats from './components/Chats/Chats.jsx'
import MyProfile from './components/MyProfile/MyProfile.jsx'
import Settings from './components/Settings/Settings.jsx'
import Login from './components/Login/Login.jsx';
import FacultyLogin from './facultyComponents/Login/FacultyLogin.jsx'
import FacultyClassroom from './facultyComponents/MyClassroom/FacultyClassroom.jsx';
import FacultyAssignments from './facultyComponents/Assignments/FacultyAssignments.jsx';
import FacultySettings from './facultyComponents/Settings/FacultySettings.jsx';
import Layout2 from './Layout2.jsx';
import FacultyDashboard from './facultyComponents/Dashboard/FacultyDashboard.jsx';
import LandingPage from './Landing.jsx';
import ProtectedRoute from './components/Protectedroute/ProtectedRoute.jsx';
import AskZestra from './Zestra/AskZestra.jsx';
const studentProtectedRoutes = {
  element: <Layout />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "subjects", element: <Subjects /> },
    { path: "assignments", element: <Assignments /> },
    {
        path: "community",
        element: <Community />
      },
    { path: "chats", element: <Chats /> },
    { path: "settings", element: <Settings /> },
    { path: "myprofile", element: <MyProfile /> } ,
    {
  path: "AskZestra",
  element: <AskZestra />
},
  ]
};
const facultyProtectedRoutes = {
  element: <Layout2 />,
  children: [
    { path: 'faculty-dashboard', element: <FacultyDashboard /> },
    { path: 'faculty-classroom', element: <FacultyClassroom /> },
    { path: 'faculty-assignments', element: <FacultyAssignments /> },
    { path: 'faculty-settings', element: <FacultySettings /> },
  ]
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/faculty-login',
    element: <FacultyLogin />
  },


  {
    element: <ProtectedRoute />,
    children: [
      studentProtectedRoutes,
      facultyProtectedRoutes
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

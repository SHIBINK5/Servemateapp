import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'

/** Import all components */
import UsernamePage from './components/UsernamePage'
import PasswordPage from './components/PasswordPage'
import RegisterPage from './components/RegisterPage'
import ProfilePage from './components/ProfilePage'
import RecoverPage from './components/RecoverPage'
import Resetpage from './components/Resetpage'
import NotfoundPage from './components/NotfoundPage'



/** root routes */
const router =createBrowserRouter([
    {
        path : '/',
        element : <UsernamePage/>
    },
    {
        path : '/register',
        element : <RegisterPage/>
    },
    {
        path : '/password',
        element : <PasswordPage/>
    },
    {
        path : '/profile',
        element : <ProfilePage/>
    },
    {
        path : '/recover',
        element : <RecoverPage/>
    },
    {
        path : '/reset',
        element : <Resetpage/>
    },
    {
        path : '*',
        element : <NotfoundPage/>
    }
])

function App() {
  return (
   <main>
    <RouterProvider router={router}></RouterProvider>
   </main>
  )
}

export default App
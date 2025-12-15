import React from 'react'
import FacultyHeader from './facultyComponents/Header/FacultyHeader'
import { Outlet } from 'react-router-dom'
import FacultyNavigations from './facultyComponents/Navigations/FacultyNavigations'

function Layout2() {
    return (
        <>
            <FacultyHeader />
            <FacultyNavigations />
            <Outlet />
        </>
    )
}

export default Layout2

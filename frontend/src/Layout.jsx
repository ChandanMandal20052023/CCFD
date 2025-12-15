import React from 'react'
import Header from './components/Header/Header'
import Navigations from './components/Navigations/Navigations'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <>
            <Header />
            <Navigations />
            <Outlet />
        </>
    )
}

export default Layout

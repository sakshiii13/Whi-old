import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../component/pages/landing/navbar/Navbar'
import Footer from '../pages/landing/Footer'


const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer/>
    
    </>
  )
}

export default MainLayout
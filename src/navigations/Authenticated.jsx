import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { adminRoutes, userRoutes } from '../constants/router'
import UserDashboard from '../component/pages/user/UserDashboard'
import AllOrders from '../component/pages/user/orders/AllOrders'
import TrackOrder from '../component/pages/user/orders/TrackOrder'
import RewardHistory from '../component/pages/user/rewards/RewardHistory'
import DashboardLayout from '../component/layout/DashboardLayout'
import AdminDashboard from '../component/pages/admin/AdminDashboard'
import { getRole } from '../utils/authStorage'
import AddProduct from '../component/pages/admin/products/AddProduct'
import ManageProduct from '../component/pages/admin/products/ManageProducts'
import Category from '../component/pages/admin/category/Category'
import Subcategory from '../component/pages/admin/category/SubCategory'
import Brands from '../component/pages/admin/category/Brands'
import ManageOrder from '../component/pages/admin/orders/ManageOrder'

const Authenticated = () => {
    const role = getRole();
  return (
    <Routes>
        {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
       {role === "user" ? (
        <>
         <Route path={userRoutes.DASHBOARD} element={<UserDashboard />} />
        <Route path={userRoutes.ALL_ORDERS} element={<AllOrders />} />
        <Route path={userRoutes.TRACK_ORDERS} element={<TrackOrder />} />
        <Route path={userRoutes.REWARDS} element={<RewardHistory />} />
        </>
       ) : (
        <>
        <Route
          path={adminRoutes.ADMIN_DASHBOARD}
          element={<AdminDashboard />}
        />

        <Route path={adminRoutes.ADD_PRODUCT} element={<AddProduct />} />
        <Route path={adminRoutes.MANAGE_PRODUCTS} element={<ManageProduct />} />
        <Route path={adminRoutes.CATEGORIES} element={<Category />} />
        <Route path={adminRoutes.SUB_CATEGORY} element={<Subcategory />} />
        <Route path={adminRoutes.BRANDS} element={<Brands />} />
        <Route path={adminRoutes.ORDERS} element={<ManageOrder />} />
        {/* <Route path={adminRoutes.ADMIN_ORDERS} element={<OrdersManagement />} />
        <Route path={adminRoutes.ADMIN_CATEGORIES} element={<CategoriesManagement />} />
        <Route path={adminRoutes.ADMIN_REVIEWS} element={<ReviewsManagement />} /> 
     */}
        </>
       )}
       <Route path="*" element={<Navigate to={role === "user" ? userRoutes.DASHBOARD : adminRoutes.ADMIN_DASHBOARD} />} />

        
      </Route>
    </Routes>
  )
}

export default Authenticated
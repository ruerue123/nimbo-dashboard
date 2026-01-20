import React, { useEffect, useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { socket } from '../utils/utils'
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, updateSellers } from '../store/Reducers/chatReducer';
import ErrorBoundary from '../components/ErrorBoundary';

const MainLayout = () => {

    const dispatch = useDispatch()
    const {userInfo } = useSelector(state => state.auth)

    useEffect(() => {
        if (userInfo && userInfo.role === 'seller') {
            socket.emit('add_seller', userInfo._id,userInfo)
        } else {
            socket.emit('add_admin', userInfo)
        }
    },[userInfo])

    useEffect(() => {
        socket.on('activeCustomer',(customers)=>{
            dispatch(updateCustomer(customers))
        })
        socket.on('activeSeller',(sellers)=>{
            dispatch(updateSellers(sellers))
        })
    })

    const [showSidebar, setShowSidebar] = useState(false)

    return (
        <div className='bg-gray-50 w-full min-h-screen'>
            <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

           <div className='ml-0 lg:ml-[280px] pt-[75px] sm:pt-[95px] transition-all min-h-screen overflow-x-hidden'>
               <ErrorBoundary>
                   <Suspense fallback={
                       <div className='flex items-center justify-center h-[calc(100vh-95px)]'>
                           <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500'></div>
                       </div>
                   }>
                       <Outlet/>
                   </Suspense>
               </ErrorBoundary>
           </div>
        </div>
    );
};

export default MainLayout;
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/Reducers/authReducer';
import logo from '../assets/logo.png';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
    const dispatch = useDispatch();
    const { role } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [allNav, setAllNav] = useState([]);

    useEffect(() => {
        const navs = getNav(role);
        setAllNav(navs);
    }, [role]);

    return (
        <div>
            {/* Overlay - only visible on mobile when sidebar is open */}
            <div
                onClick={() => setShowSidebar(false)}
                className={`fixed duration-300 lg:hidden ${!showSidebar ? 'invisible opacity-0 pointer-events-none' : 'visible opacity-100 pointer-events-auto'} w-screen h-screen bg-gray-900/50 backdrop-blur-sm top-0 left-0 z-10`}
            />

            {/* Sidebar */}
            <div className={`w-[280px] fixed bg-white z-50 top-0 h-screen shadow-2xl transition-all duration-300 ${showSidebar ? 'left-0' : '-left-[280px] lg:left-0'}`}>
                {/* Logo */}
                <div className='h-[80px] flex justify-center items-center border-b border-gray-100'>
                    <Link to='/' className='w-[160px] h-[45px]'>
                        <img className='w-full h-full object-contain' src={logo} alt="Logo" />
                    </Link>
                </div>

                {/* Navigation */}
                <div className='px-4 py-6 h-[calc(100vh-160px)] overflow-y-auto'>
                    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3'>Menu</p>
                    <ul className='space-y-1'>
                        {allNav.map((n, i) => (
                            <li key={i}>
                                <Link
                                    to={n.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${pathname === n.path
                                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-cyan-600'
                                        }`}
                                >
                                    <span className={`text-xl ${pathname === n.path ? 'text-white' : 'text-gray-400 group-hover:text-cyan-500'}`}>
                                        {n.icon}
                                    </span>
                                    <span className='font-medium'>{n.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Logout Button */}
                <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white'>
                    <button
                        onClick={() => dispatch(logout({ navigate, role }))}
                        className='flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group'
                    >
                        <span className='text-xl text-gray-400 group-hover:text-red-500'>
                            <BiLogOutCircle />
                        </span>
                        <span className='font-medium'>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

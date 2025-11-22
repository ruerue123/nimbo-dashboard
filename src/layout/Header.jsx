import React from 'react';
import { FaList } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';

const Header = ({ showSidebar, setShowSidebar }) => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <div className='fixed top-0 left-0 w-full py-4 px-4 lg:px-6 z-40'>
            <div className='ml-0 lg:ml-[280px] rounded-2xl h-[70px] flex justify-between items-center bg-white shadow-sm border border-gray-100 px-6 transition-all'>
                {/* Mobile Menu Toggle */}
                <div
                    onClick={() => setShowSidebar(!showSidebar)}
                    className='w-10 h-10 flex lg:hidden rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/30 justify-center items-center cursor-pointer hover:shadow-xl transition-all'
                >
                    <FaList className='text-white' />
                </div>

                {/* Search Bar */}
                <div className='hidden md:block flex-1 max-w-md'>
                    <div className='relative'>
                        <input
                            className='w-full px-4 py-2.5 pl-10 outline-none bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                            type="text"
                            placeholder='Search...'
                        />
                        <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-4'>
                    {/* Notifications */}
                    <button className='relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'>
                        <IoNotificationsOutline className='text-xl text-gray-600' />
                        <span className='absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white'></span>
                    </button>

                    {/* Divider */}
                    <div className='hidden sm:block w-px h-10 bg-gray-200'></div>

                    {/* User Info */}
                    <div className='flex items-center gap-3'>
                        <div className='hidden sm:flex flex-col items-end'>
                            <h2 className='text-sm font-semibold text-gray-800'>{userInfo.name}</h2>
                            <span className='text-xs text-gray-500 capitalize'>{userInfo.role}</span>
                        </div>

                        <div className='w-11 h-11 rounded-xl overflow-hidden ring-2 ring-gray-100'>
                            {userInfo.role === 'admin' ? (
                                <div className='w-full h-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center'>
                                    <span className='text-white font-bold text-lg'>A</span>
                                </div>
                            ) : (
                                userInfo.image ? (
                                    <img className='w-full h-full object-cover' src={userInfo.image} alt={userInfo.name} />
                                ) : (
                                    <div className='w-full h-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center'>
                                        <span className='text-white font-bold text-lg'>{userInfo.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;

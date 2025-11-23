import React, { useEffect, useState } from 'react';
import { FaImages } from "react-icons/fa6";
import { FadeLoader, PropagateLoader } from 'react-spinners';
import { FaUser, FaStore, FaLock, FaCamera, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { profile_image_upload, messageClear, profile_info_add, change_password } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';

const Profile = () => {
    const [state, setState] = useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: ''
    })

    const dispatch = useDispatch()
    const { userInfo, loader, successMessage, errorMessage } = useSelector(state => state.auth)

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage, dispatch])

    const add_image = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            dispatch(profile_image_upload(formData))
        }
    }

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const add = (e) => {
        e.preventDefault()
        dispatch(profile_info_add(state))
    }

    // Change Password
    const [passwordData, setPasswordData] = useState({
        email: "",
        old_password: "",
        new_password: ""
    });

    const pinputHandle = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        dispatch(change_password(passwordData));
    }

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center'>
                    <FaUser className='text-cyan-600 text-xl' />
                </div>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Profile Settings</h1>
                    <p className='text-gray-500 text-sm'>Manage your account and shop information</p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Left Column */}
                <div className='space-y-6'>
                    {/* Profile Image Card */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='p-6'>
                            <div className='flex flex-col items-center'>
                                <div className='relative'>
                                    {userInfo?.image ? (
                                        <label htmlFor="img" className='block w-32 h-32 rounded-2xl overflow-hidden cursor-pointer group relative'>
                                            <img src={userInfo.image} alt="" className='w-full h-full object-cover' />
                                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                                <FaCamera className='text-white text-2xl' />
                                            </div>
                                            {loader && (
                                                <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                                                    <FadeLoader color='#fff' height={10} />
                                                </div>
                                            )}
                                        </label>
                                    ) : (
                                        <label htmlFor="img" className='w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-all'>
                                            <FaImages className='text-3xl text-gray-400 mb-2' />
                                            <span className='text-sm text-gray-500'>Upload</span>
                                            {loader && (
                                                <div className='absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl'>
                                                    <FadeLoader color='#fff' height={10} />
                                                </div>
                                            )}
                                        </label>
                                    )}
                                    <input onChange={add_image} type="file" className='hidden' id='img' accept='image/*' />
                                </div>
                                <h3 className='mt-4 text-lg font-bold text-gray-800'>{userInfo?.name}</h3>
                                <p className='text-gray-500 text-sm'>{userInfo?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Info Card */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='px-6 py-4 border-b border-gray-100'>
                            <h2 className='text-lg font-bold text-gray-800'>Account Information</h2>
                        </div>
                        <div className='p-6 space-y-4'>
                            <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                                <span className='text-gray-500'>Name</span>
                                <span className='font-medium text-gray-800'>{userInfo?.name}</span>
                            </div>
                            <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                                <span className='text-gray-500'>Email</span>
                                <span className='font-medium text-gray-800'>{userInfo?.email}</span>
                            </div>
                            <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                                <span className='text-gray-500'>Role</span>
                                <span className='inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 capitalize'>
                                    {userInfo?.role}
                                </span>
                            </div>
                            <div className='flex justify-between items-center py-2'>
                                <span className='text-gray-500'>Status</span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${userInfo?.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {userInfo?.status === 'active' ? <FaCheckCircle /> : <FaTimesCircle />}
                                    {userInfo?.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className='space-y-6'>
                    {/* Shop Info Card */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='px-6 py-4 border-b border-gray-100 flex items-center gap-2'>
                            <FaStore className='text-cyan-600' />
                            <h2 className='text-lg font-bold text-gray-800'>Shop Information</h2>
                        </div>
                        <div className='p-6'>
                            {!userInfo?.shopInfo ? (
                                <form onSubmit={add} className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Shop Name</label>
                                        <input
                                            value={state.shopName}
                                            onChange={inputHandle}
                                            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                            type="text"
                                            name='shopName'
                                            placeholder='Enter your shop name'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Division</label>
                                        <input
                                            value={state.division}
                                            onChange={inputHandle}
                                            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                            type="text"
                                            name='division'
                                            placeholder='Division name'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>District</label>
                                        <input
                                            value={state.district}
                                            onChange={inputHandle}
                                            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                            type="text"
                                            name='district'
                                            placeholder='District name'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Sub District</label>
                                        <input
                                            value={state.sub_district}
                                            onChange={inputHandle}
                                            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                            type="text"
                                            name='sub_district'
                                            placeholder='Sub district name'
                                        />
                                    </div>
                                    <button
                                        disabled={loader}
                                        className='w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50'
                                    >
                                        {loader ? <PropagateLoader color='#fff' size={10} /> : 'Save Shop Info'}
                                    </button>
                                </form>
                            ) : (
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                                        <span className='text-gray-500'>Shop Name</span>
                                        <span className='font-medium text-gray-800'>{userInfo.shopInfo?.shopName}</span>
                                    </div>
                                    <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                                        <span className='text-gray-500'>Division</span>
                                        <span className='font-medium text-gray-800'>{userInfo.shopInfo?.division}</span>
                                    </div>
                                    <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                                        <span className='text-gray-500'>District</span>
                                        <span className='font-medium text-gray-800'>{userInfo.shopInfo?.district}</span>
                                    </div>
                                    <div className='flex justify-between items-center py-2'>
                                        <span className='text-gray-500'>Sub District</span>
                                        <span className='font-medium text-gray-800'>{userInfo.shopInfo?.sub_district}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='px-6 py-4 border-b border-gray-100 flex items-center gap-2'>
                            <FaLock className='text-cyan-600' />
                            <h2 className='text-lg font-bold text-gray-800'>Change Password</h2>
                        </div>
                        <div className='p-6'>
                            <form onSubmit={handlePasswordChange} className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                                    <input
                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                        type="email"
                                        name='email'
                                        value={passwordData.email}
                                        onChange={pinputHandle}
                                        placeholder='Enter your email'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Current Password</label>
                                    <input
                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                        type="password"
                                        name='old_password'
                                        value={passwordData.old_password}
                                        onChange={pinputHandle}
                                        placeholder='Enter current password'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>New Password</label>
                                    <input
                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                        type="password"
                                        name='new_password'
                                        value={passwordData.new_password}
                                        onChange={pinputHandle}
                                        placeholder='Enter new password'
                                    />
                                </div>
                                <button
                                    disabled={loader}
                                    className='w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50'
                                >
                                    {loader ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

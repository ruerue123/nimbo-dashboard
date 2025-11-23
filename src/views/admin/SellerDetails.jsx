import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { get_seller, seller_status_update, messageClear } from '../../store/Reducers/sellerReducer';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaStore, FaMapMarkerAlt, FaCheckCircle, FaClock, FaTimesCircle, FaArrowLeft, FaCreditCard, FaUserShield } from 'react-icons/fa';

const SellerDetails = () => {
    const dispatch = useDispatch()
    const { seller, successMessage } = useSelector(state => state.seller)
    const { sellerId } = useParams()

    const [status, setStatus] = useState('')

    useEffect(() => {
        dispatch(get_seller(sellerId))
    }, [sellerId, dispatch])

    const submit = (e) => {
        e.preventDefault()
        if (status) {
            dispatch(seller_status_update({ sellerId, status }))
        }
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
    }, [successMessage, dispatch])

    useEffect(() => {
        if (seller) {
            setStatus(seller.status)
        }
    }, [seller])

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className='inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium'><FaCheckCircle /> Active</span>;
            case 'pending':
                return <span className='inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium'><FaClock /> Pending</span>;
            case 'deactive':
                return <span className='inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium'><FaTimesCircle /> Inactive</span>;
            default:
                return <span className='inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'>{status}</span>;
        }
    };

    const getPaymentBadge = (payment) => {
        if (payment === 'active') {
            return <span className='inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium'><FaCheckCircle /> Paid</span>;
        }
        return <span className='inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium'><FaClock /> Pending</span>;
    };

    return (
        <div className='px-4 lg:px-6 py-5'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center gap-3'>
                        <Link to='/admin/dashboard/sellers' className='w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors'>
                            <FaArrowLeft />
                        </Link>
                        <div>
                            <h1 className='text-lg font-bold text-gray-800'>Seller Details</h1>
                            <p className='text-xs text-gray-500'>View and manage seller information</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        {getStatusBadge(seller?.status)}
                        {getPaymentBadge(seller?.payment)}
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Seller Profile Card */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='bg-gradient-to-r from-cyan-500 to-cyan-600 h-24 relative'>
                        <div className='absolute -bottom-12 left-1/2 -translate-x-1/2'>
                            <div className='w-24 h-24 bg-white rounded-2xl shadow-lg p-1 overflow-hidden'>
                                {seller?.image ? (
                                    <img src={seller.image} alt={seller.name} className='w-full h-full object-cover rounded-xl' />
                                ) : (
                                    <div className='w-full h-full bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center'>
                                        <span className='text-white text-3xl font-bold'>{seller?.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='pt-16 pb-6 px-6 text-center'>
                        <h2 className='text-xl font-bold text-gray-800 mb-1'>{seller?.name}</h2>
                        <p className='text-sm text-gray-500 flex items-center justify-center gap-1'>
                            <FaEnvelope className='text-xs' /> {seller?.email}
                        </p>

                        <div className='mt-4 pt-4 border-t border-gray-100'>
                            <div className='flex justify-center gap-6'>
                                <div className='text-center'>
                                    <p className='text-xs text-gray-500'>Role</p>
                                    <p className='font-semibold text-gray-800 capitalize'>{seller?.role}</p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-xs text-gray-500'>Status</p>
                                    <p className='font-semibold text-gray-800 capitalize'>{seller?.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='p-4 border-b border-gray-100 flex items-center gap-2'>
                        <FaUser className='text-cyan-500' />
                        <h3 className='font-bold text-gray-800'>Basic Information</h3>
                    </div>
                    <div className='p-4 space-y-4'>
                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaUser className='text-cyan-500' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Full Name</p>
                                <p className='font-medium text-gray-800'>{seller?.name || 'N/A'}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaEnvelope className='text-cyan-500' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Email Address</p>
                                <p className='font-medium text-gray-800'>{seller?.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaUserShield className='text-cyan-500' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Role</p>
                                <p className='font-medium text-gray-800 capitalize'>{seller?.role || 'N/A'}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaCreditCard className='text-cyan-500' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Payment Status</p>
                                <p className='font-medium text-gray-800 capitalize'>{seller?.payment || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shop Info */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='p-4 border-b border-gray-100 flex items-center gap-2'>
                        <FaStore className='text-purple-500' />
                        <h3 className='font-bold text-gray-800'>Shop Information</h3>
                    </div>
                    <div className='p-4 space-y-4'>
                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaStore className='text-purple-500' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Shop Name</p>
                                <p className='font-medium text-gray-800'>{seller?.shopInfo?.shopName || 'N/A'}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaMapMarkerAlt className='text-purple-500' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Division</p>
                                <p className='font-medium text-gray-800'>{seller?.shopInfo?.division || 'N/A'}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaMapMarkerAlt className='text-purple-500' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>District</p>
                                <p className='font-medium text-gray-800'>{seller?.shopInfo?.district || 'N/A'}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaMapMarkerAlt className='text-purple-500' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Sub District / State</p>
                                <p className='font-medium text-gray-800'>{seller?.shopInfo?.sub_district || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Form */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-4'>
                <h3 className='font-bold text-gray-800 mb-4'>Update Seller Status</h3>
                <form onSubmit={submit} className='flex flex-col sm:flex-row gap-3'>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='flex-1 sm:flex-none sm:w-[200px] px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-cyan-500 outline-none'
                        required
                    >
                        <option value="">-- Select Status --</option>
                        <option value="active">Active</option>
                        <option value="deactive">Inactive</option>
                    </select>
                    <button
                        type='submit'
                        className='px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium rounded-xl hover:shadow-lg transition-all'
                    >
                        Update Status
                    </button>
                </form>

                {seller?.status === 'deactive' && (
                    <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl'>
                        <p className='text-sm text-amber-800'>
                            <strong>Note:</strong> This seller is currently inactive. Their products will not appear on the storefront until reactivated.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDetails;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye, FaSearch, FaUserClock, FaEnvelope, FaCheckCircle, FaClock } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_request } from '../../store/Reducers/sellerReducer';

const SellerRequest = () => {
    const dispatch = useDispatch()
    const { sellers, totalSeller } = useSelector(state => state.seller)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(10)

    useEffect(() => {
        dispatch(get_seller_request({
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }))
    }, [parPage, searchValue, currentPage, dispatch])

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>Active</span>;
            case 'pending':
                return <span className='px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium'>Pending</span>;
            case 'deactive':
                return <span className='px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium'>Inactive</span>;
            default:
                return <span className='px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'>{status}</span>;
        }
    };

    const getPaymentBadge = (payment) => {
        switch (payment?.toLowerCase()) {
            case 'active':
                return <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1'><FaCheckCircle className='text-[10px]' /> Paid</span>;
            case 'pending':
                return <span className='px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1'><FaClock className='text-[10px]' /> Pending</span>;
            default:
                return <span className='px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'>{payment}</span>;
        }
    };

    return (
        <div className='px-4 lg:px-6 py-5'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center'>
                            <FaUserClock className='text-white' />
                        </div>
                        <div>
                            <h1 className='text-lg font-bold text-gray-800'>Seller Requests</h1>
                            <p className='text-xs text-gray-500'>{totalSeller || sellers.length} pending requests</p>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 w-full sm:w-auto'>
                        <select
                            onChange={(e) => setParPage(parseInt(e.target.value))}
                            value={parPage}
                            className='px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:border-cyan-500 outline-none'
                        >
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                        <div className='relative flex-1 sm:flex-none'>
                            <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                            <input
                                onChange={e => setSearchValue(e.target.value)}
                                value={searchValue}
                                className='w-full sm:w-[200px] pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:border-cyan-500 outline-none'
                                type="text"
                                placeholder='Search requests...'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Requests List */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                {/* Desktop Table Header */}
                <div className='hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase'>
                    <div className='col-span-1'>#</div>
                    <div className='col-span-3'>Seller</div>
                    <div className='col-span-3'>Email</div>
                    <div className='col-span-2'>Payment</div>
                    <div className='col-span-2'>Status</div>
                    <div className='col-span-1'>Action</div>
                </div>

                <div className='divide-y divide-gray-100'>
                    {sellers.length === 0 ? (
                        <div className='p-8 text-center'>
                            <FaUserClock className='text-4xl text-gray-300 mx-auto mb-3' />
                            <p className='text-gray-500'>No pending seller requests</p>
                        </div>
                    ) : (
                        sellers.map((seller, i) => (
                            <div key={i} className='p-4 hover:bg-gray-50 transition-colors'>
                                {/* Mobile View */}
                                <div className='lg:hidden space-y-3'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center'>
                                            {seller.image ? (
                                                <img src={seller.image} alt={seller.name} className='w-full h-full object-cover' />
                                            ) : (
                                                <span className='text-white font-bold text-lg'>{seller.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-medium text-gray-800 truncate'>{seller.name}</h3>
                                            <p className='text-xs text-gray-500 truncate flex items-center gap-1'>
                                                <FaEnvelope className='text-[10px]' /> {seller.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        {getPaymentBadge(seller.payment)}
                                        {getStatusBadge(seller.status)}
                                    </div>
                                    <Link
                                        to={`/admin/dashboard/seller/details/${seller._id}`}
                                        className='block w-full py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-center rounded-lg text-sm font-medium'
                                    >
                                        View Details
                                    </Link>
                                </div>

                                {/* Desktop View */}
                                <div className='hidden lg:grid grid-cols-12 gap-4 items-center'>
                                    <div className='col-span-1 text-sm text-gray-600 font-medium'>
                                        {i + 1}
                                    </div>
                                    <div className='col-span-3 flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center'>
                                            {seller.image ? (
                                                <img src={seller.image} alt={seller.name} className='w-full h-full object-cover' />
                                            ) : (
                                                <span className='text-white font-bold'>{seller.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className='font-medium text-gray-800 truncate'>{seller.name}</span>
                                    </div>
                                    <div className='col-span-3 text-sm text-gray-500 truncate'>
                                        {seller.email}
                                    </div>
                                    <div className='col-span-2'>
                                        {getPaymentBadge(seller.payment)}
                                    </div>
                                    <div className='col-span-2'>
                                        {getStatusBadge(seller.status)}
                                    </div>
                                    <div className='col-span-1'>
                                        <Link
                                            to={`/admin/dashboard/seller/details/${seller._id}`}
                                            className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all'
                                        >
                                            <FaEye /> View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {(totalSeller || sellers.length) > parPage && (
                    <div className='p-4 border-t border-gray-100 flex justify-end'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalSeller || sellers.length}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerRequest;

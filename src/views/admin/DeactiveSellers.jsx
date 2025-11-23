import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye, FaSearch, FaUserSlash, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_deactive_sellers } from '../../store/Reducers/sellerReducer';

const DeactiveSellers = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(10)

    const { sellers, totalSeller } = useSelector(state => state.seller)

    useEffect(() => {
        dispatch(get_deactive_sellers({
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }))
    }, [searchValue, currentPage, parPage, dispatch])

    return (
        <div className='px-4 lg:px-6 py-5'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center'>
                            <FaUserSlash className='text-white' />
                        </div>
                        <div>
                            <h1 className='text-lg font-bold text-gray-800'>Inactive Sellers</h1>
                            <p className='text-xs text-gray-500'>{totalSeller || sellers.length} deactivated accounts</p>
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
                                placeholder='Search sellers...'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sellers Grid */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                {/* Desktop Table Header */}
                <div className='hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase'>
                    <div className='col-span-3'>Seller</div>
                    <div className='col-span-2'>Shop</div>
                    <div className='col-span-3'>Email</div>
                    <div className='col-span-2'>Location</div>
                    <div className='col-span-2'>Action</div>
                </div>

                <div className='divide-y divide-gray-100'>
                    {sellers.length === 0 ? (
                        <div className='p-8 text-center'>
                            <FaUserSlash className='text-4xl text-gray-300 mx-auto mb-3' />
                            <p className='text-gray-500'>No inactive sellers</p>
                        </div>
                    ) : (
                        sellers.map((seller, i) => (
                            <div key={i} className='p-4 hover:bg-gray-50 transition-colors'>
                                {/* Mobile View */}
                                <div className='lg:hidden space-y-3'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 opacity-60'>
                                            {seller.image ? (
                                                <img src={seller.image} alt={seller.name} className='w-full h-full object-cover grayscale' />
                                            ) : (
                                                <div className='w-full h-full bg-gray-400 flex items-center justify-center text-white font-bold'>
                                                    {seller.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-medium text-gray-800 truncate'>{seller.name}</h3>
                                            <p className='text-xs text-gray-500 truncate'>{seller.shopInfo?.shopName}</p>
                                        </div>
                                        <span className='px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium'>
                                            Inactive
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-4 text-xs text-gray-500'>
                                        <span className='flex items-center gap-1'>
                                            <FaEnvelope /> {seller.email}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/admin/dashboard/seller/details/${seller._id}`}
                                        className='block w-full py-2 bg-gray-500 text-white text-center rounded-lg text-sm font-medium'
                                    >
                                        View Details
                                    </Link>
                                </div>

                                {/* Desktop View */}
                                <div className='hidden lg:grid grid-cols-12 gap-4 items-center'>
                                    <div className='col-span-3 flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 opacity-60'>
                                            {seller.image ? (
                                                <img src={seller.image} alt={seller.name} className='w-full h-full object-cover grayscale' />
                                            ) : (
                                                <div className='w-full h-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm'>
                                                    {seller.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <span className='font-medium text-gray-600 truncate'>{seller.name}</span>
                                    </div>
                                    <div className='col-span-2 text-sm text-gray-500 truncate'>
                                        {seller.shopInfo?.shopName || 'N/A'}
                                    </div>
                                    <div className='col-span-3 text-sm text-gray-500 truncate'>
                                        {seller.email}
                                    </div>
                                    <div className='col-span-2 text-sm text-gray-500'>
                                        {seller.shopInfo?.district || 'N/A'}
                                    </div>
                                    <div className='col-span-2'>
                                        <Link
                                            to={`/admin/dashboard/seller/details/${seller._id}`}
                                            className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-medium hover:bg-gray-600 transition-colors'
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

export default DeactiveSellers;

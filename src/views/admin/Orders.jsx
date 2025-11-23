import React, { useEffect, useState } from 'react';
import { FaEye, FaChevronDown, FaChevronUp, FaSearch, FaBox, FaSpinner } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(10)
    const [expandedOrder, setExpandedOrder] = useState(null)

    const { myOrders, totalOrder } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(get_admin_orders({
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }))
    }, [searchValue, currentPage, parPage, dispatch])

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return 'bg-emerald-100 text-emerald-700';
            case 'unpaid': return 'bg-red-100 text-red-700';
            case 'cod': return 'bg-amber-100 text-amber-700';
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'dispatched': return 'bg-purple-100 text-purple-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatStatus = (status) => {
        return status?.replace('_', ' ').charAt(0).toUpperCase() + status?.replace('_', ' ').slice(1);
    };

    return (
        <div className='px-4 lg:px-6 py-5'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center'>
                            <FaBox className='text-white' />
                        </div>
                        <div>
                            <h1 className='text-lg font-bold text-gray-800'>Orders</h1>
                            <p className='text-xs text-gray-500'>{totalOrder} total orders</p>
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
                                placeholder='Search orders...'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                {/* Desktop Table Header */}
                <div className='hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase'>
                    <div className='col-span-3'>Order ID</div>
                    <div className='col-span-2'>Price</div>
                    <div className='col-span-2'>Payment</div>
                    <div className='col-span-2'>Status</div>
                    <div className='col-span-2'>Action</div>
                    <div className='col-span-1'></div>
                </div>

                {/* Orders List */}
                <div className='divide-y divide-gray-100'>
                    {myOrders.length === 0 ? (
                        <div className='p-8 text-center'>
                            <FaBox className='text-4xl text-gray-300 mx-auto mb-3' />
                            <p className='text-gray-500'>No orders found</p>
                        </div>
                    ) : (
                        myOrders.map((order, i) => (
                            <div key={i}>
                                {/* Main Order Row */}
                                <div className='p-4 hover:bg-gray-50 transition-colors'>
                                    {/* Mobile View */}
                                    <div className='lg:hidden space-y-3'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm font-medium text-gray-800'>#{order._id?.slice(-8)}</span>
                                            <span className='text-lg font-bold text-cyan-600'>${Number(order.price).toFixed(2)}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.payment_status)}`}>
                                                {formatStatus(order.payment_status)}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.delivery_status)}`}>
                                                {formatStatus(order.delivery_status)}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Link
                                                to={`/admin/dashboard/order/details/${order._id}`}
                                                className='flex-1 py-2 bg-cyan-500 text-white text-center rounded-lg text-sm font-medium'
                                            >
                                                View Details
                                            </Link>
                                            {order.suborder?.length > 0 && (
                                                <button
                                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                    className='px-3 py-2 bg-gray-100 text-gray-600 rounded-lg'
                                                >
                                                    {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Desktop View */}
                                    <div className='hidden lg:grid grid-cols-12 gap-4 items-center'>
                                        <div className='col-span-3'>
                                            <span className='text-sm font-medium text-gray-800'>#{order._id?.slice(-8)}</span>
                                        </div>
                                        <div className='col-span-2'>
                                            <span className='text-sm font-bold text-gray-800'>${Number(order.price).toFixed(2)}</span>
                                        </div>
                                        <div className='col-span-2'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.payment_status)}`}>
                                                {formatStatus(order.payment_status)}
                                            </span>
                                        </div>
                                        <div className='col-span-2'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.delivery_status)}`}>
                                                {formatStatus(order.delivery_status)}
                                            </span>
                                        </div>
                                        <div className='col-span-2'>
                                            <Link
                                                to={`/admin/dashboard/order/details/${order._id}`}
                                                className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 text-white rounded-lg text-xs font-medium hover:bg-cyan-600 transition-colors'
                                            >
                                                <FaEye /> View
                                            </Link>
                                        </div>
                                        <div className='col-span-1'>
                                            {order.suborder?.length > 0 && (
                                                <button
                                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                    className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'
                                                >
                                                    {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Suborders (Expanded) */}
                                {expandedOrder === order._id && order.suborder?.length > 0 && (
                                    <div className='bg-gray-50 border-t border-gray-100'>
                                        <div className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase'>Sub-orders</div>
                                        {order.suborder.map((sub, j) => (
                                            <div key={j} className='px-4 py-3 border-t border-gray-100 flex flex-wrap items-center gap-4'>
                                                <span className='text-sm text-gray-600'>#{sub._id?.slice(-8)}</span>
                                                <span className='text-sm font-medium text-gray-800'>${Number(sub.price).toFixed(2)}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(sub.payment_status)}`}>
                                                    {formatStatus(sub.payment_status)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(sub.delivery_status)}`}>
                                                    {formatStatus(sub.delivery_status)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalOrder > parPage && (
                    <div className='p-4 border-t border-gray-100 flex justify-end'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalOrder}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

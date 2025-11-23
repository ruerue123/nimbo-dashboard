import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye, FaShoppingBag, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
    const dispatch = useDispatch()
    const { myOrders, totalOrder } = useSelector(state => state.order)
    const { userInfo } = useSelector(state => state.auth)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(10)

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            sellerId: userInfo._id
        }
        dispatch(get_seller_orders(obj))
    }, [searchValue, currentPage, parPage, userInfo._id, dispatch])

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-emerald-100 text-emerald-700';
            case 'cod':
                return 'bg-amber-100 text-amber-700';
            default:
                return 'bg-red-100 text-red-700';
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-emerald-100 text-emerald-700';
            case 'pending':
            case 'order_received':
                return 'bg-amber-100 text-amber-700';
            case 'processing':
            case 'warehouse':
                return 'bg-blue-100 text-blue-700';
            case 'dispatched':
                return 'bg-purple-100 text-purple-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    const formatStatus = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'order_received': 'Order Received',
            'processing': 'Processing',
            'dispatched': 'Dispatched',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        }
        return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
    }

    const formatPrice = (price) => {
        return Number(price).toFixed(2)
    }

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center'>
                    <FaShoppingBag className='text-emerald-600 text-xl' />
                </div>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Orders</h1>
                    <p className='text-gray-500 text-sm'>{totalOrder} orders received</p>
                </div>
            </div>

            {/* Main Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                {/* Search & Filter Bar */}
                <div className='p-4 border-b border-gray-100'>
                    <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                        <div className='relative w-full sm:w-80'>
                            <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                            <input
                                type="text"
                                placeholder='Search orders...'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className='w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                            />
                        </div>
                        <div className='flex items-center gap-3'>
                            <span className='text-sm text-gray-500'>Show:</span>
                            <select
                                value={parPage}
                                onChange={(e) => setParPage(e.target.value)}
                                className='px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Order ID</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Payment</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Date</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {myOrders.map((d, i) => (
                                <tr key={i} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm font-medium text-gray-800'>#{d._id.slice(-8)}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm font-semibold text-gray-800'>${formatPrice(d.price)}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadge(d.payment_status)}`}>
                                            {d.payment_status === 'cod' ? 'Cash on Delivery' : d.payment_status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(d.delivery_status)}`}>
                                            {formatStatus(d.delivery_status)}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm text-gray-500'>{d.date}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <Link
                                            to={`/seller/dashboard/order/details/${d._id}`}
                                            className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-600 text-sm font-medium rounded-lg hover:bg-cyan-100 transition-colors'
                                        >
                                            <FaEye className='text-xs' />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {myOrders.length === 0 && (
                        <div className='text-center py-12'>
                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <FaShoppingBag className='text-2xl text-gray-400' />
                            </div>
                            <p className='text-gray-500'>No orders found</p>
                        </div>
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
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

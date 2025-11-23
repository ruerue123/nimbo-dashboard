import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { admin_order_status_update, get_admin_order, messageClear } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaPhone, FaUser, FaCreditCard, FaStore, FaCheckCircle, FaClock, FaTruck, FaTimesCircle } from 'react-icons/fa';

const OrderDetails = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const [status, setStatus] = useState('')
    const { order, errorMessage, successMessage } = useSelector(state => state.order)

    useEffect(() => {
        setStatus(order?.delivery_status)
    }, [order])

    useEffect(() => {
        dispatch(get_admin_order(orderId))
    }, [orderId, dispatch])

    const status_update = (e) => {
        dispatch(admin_order_status_update({ orderId, info: { status: e.target.value } }))
        setStatus(e.target.value)
    }

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

    const formatPrice = (price) => Number(price || 0).toFixed(2)

    const getStatusBadge = (status) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'dispatched': return 'bg-purple-100 text-purple-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'warehouse': return 'bg-indigo-100 text-indigo-700';
            case 'placed': return 'bg-cyan-100 text-cyan-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'paid': return 'bg-emerald-100 text-emerald-700';
            case 'cod': return 'bg-amber-100 text-amber-700';
            default: return 'bg-red-100 text-red-700';
        }
    };

    const formatStatus = (status) => {
        const map = {
            'pending': 'Pending', 'processing': 'Processing', 'warehouse': 'In Warehouse',
            'placed': 'Placed', 'dispatched': 'Dispatched', 'delivered': 'Delivered', 'cancelled': 'Cancelled'
        };
        return map[status] || status;
    };

    return (
        <div className='px-4 lg:px-6 py-5'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center gap-3'>
                        <Link to='/admin/dashboard/orders' className='w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors'>
                            <FaArrowLeft />
                        </Link>
                        <div>
                            <h1 className='text-lg font-bold text-gray-800'>Order #{order._id?.slice(-8)}</h1>
                            <p className='text-xs text-gray-500'>{order.date}</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap items-center gap-3'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadge(order.payment_status)}`}>
                            {order.payment_status === 'paid' ? 'Paid' : order.payment_status === 'cod' ? 'COD' : 'Unpaid'}
                        </span>
                        <select
                            onChange={status_update}
                            value={status}
                            className='px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:border-cyan-500 outline-none'
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="warehouse">In Warehouse</option>
                            <option value="placed">Placed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Order Summary & Customer Info */}
                <div className='space-y-4'>
                    {/* Order Summary */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='p-4 border-b border-gray-100 flex items-center gap-2'>
                            <FaBox className='text-cyan-500' />
                            <h3 className='font-bold text-gray-800'>Order Summary</h3>
                        </div>
                        <div className='p-4'>
                            <div className='flex justify-between items-center mb-3'>
                                <span className='text-gray-500'>Order ID</span>
                                <span className='font-medium text-gray-800'>#{order._id?.slice(-8)}</span>
                            </div>
                            <div className='flex justify-between items-center mb-3'>
                                <span className='text-gray-500'>Date</span>
                                <span className='font-medium text-gray-800'>{order.date}</span>
                            </div>
                            <div className='flex justify-between items-center mb-3'>
                                <span className='text-gray-500'>Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.delivery_status)}`}>
                                    {formatStatus(order.delivery_status)}
                                </span>
                            </div>
                            <div className='flex justify-between items-center pt-3 border-t border-gray-100'>
                                <span className='font-bold text-gray-800'>Total</span>
                                <span className='text-xl font-bold text-cyan-600'>${formatPrice(order.price)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='p-4 border-b border-gray-100 flex items-center gap-2'>
                            <FaUser className='text-purple-500' />
                            <h3 className='font-bold text-gray-800'>Customer Details</h3>
                        </div>
                        <div className='p-4 space-y-3'>
                            <div className='flex items-start gap-3'>
                                <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                    <FaUser className='text-purple-500' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500'>Customer Name</p>
                                    <p className='font-medium text-gray-800'>{order.shippingInfo?.name || 'N/A'}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                    <FaMapMarkerAlt className='text-purple-500' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500'>Delivery Address</p>
                                    <p className='font-medium text-gray-800 text-sm'>
                                        {order.shippingInfo?.address}, {order.shippingInfo?.area}, {order.shippingInfo?.city}, {order.shippingInfo?.province}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                    <FaPhone className='text-purple-500' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500'>Phone</p>
                                    <p className='font-medium text-gray-800'>{order.shippingInfo?.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                                    <FaCreditCard className='text-purple-500' />
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500'>Payment Status</p>
                                    <p className='font-medium text-gray-800 capitalize'>{order.payment_status || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products & Suborders */}
                <div className='lg:col-span-2 space-y-4'>
                    {/* Main Order Products */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <FaBox className='text-cyan-500' />
                                <h3 className='font-bold text-gray-800'>Order Items</h3>
                            </div>
                            <span className='text-sm text-gray-500'>{order.products?.length || 0} item(s)</span>
                        </div>
                        <div className='divide-y divide-gray-100'>
                            {order.products && order.products.map((p, i) => (
                                <div key={i} className='p-4 flex gap-4'>
                                    <div className='w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0'>
                                        <img src={p.images[0]} alt={p.name} className='w-full h-full object-cover' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h4 className='font-medium text-gray-800 truncate'>{p.name}</h4>
                                        <p className='text-sm text-gray-500'>Brand: {p.brand}</p>
                                        <div className='flex items-center gap-4 mt-1'>
                                            <span className='text-sm text-gray-500'>Qty: <span className='font-medium text-gray-800'>{p.quantity}</span></span>
                                            <span className='text-sm font-bold text-cyan-600'>${formatPrice(p.price - (p.price * p.discount / 100))}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suborders by Seller */}
                    {order?.suborder?.length > 0 && (
                        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                            <div className='p-4 border-b border-gray-100 flex items-center gap-2'>
                                <FaStore className='text-purple-500' />
                                <h3 className='font-bold text-gray-800'>Seller Orders</h3>
                            </div>
                            <div className='divide-y divide-gray-100'>
                                {order.suborder.map((o, i) => (
                                    <div key={i} className='p-4'>
                                        <div className='flex items-center justify-between mb-3'>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center'>
                                                    <span className='text-white text-sm font-bold'>{i + 1}</span>
                                                </div>
                                                <span className='font-medium text-gray-800'>Seller Order #{i + 1}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(o.delivery_status)}`}>
                                                {formatStatus(o.delivery_status)}
                                            </span>
                                        </div>

                                        <div className='space-y-2 pl-10'>
                                            {o.products?.map((p, j) => (
                                                <div key={j} className='flex gap-3 items-center'>
                                                    <div className='w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                                                        <img src={p.images[0]} alt={p.name} className='w-full h-full object-cover' />
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <h5 className='text-sm font-medium text-gray-800 truncate'>{p.name}</h5>
                                                        <div className='flex items-center gap-2 text-xs text-gray-500'>
                                                            <span>{p.brand}</span>
                                                            <span>•</span>
                                                            <span>Qty: {p.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

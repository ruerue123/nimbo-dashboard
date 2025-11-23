import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller_order, messageClear, seller_order_status_update } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const OrderDetails = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const [status, setStatus] = useState('')

    const { order, errorMessage, successMessage } = useSelector(state => state.order)

    useEffect(() => {
        setStatus(order?.delivery_status)
    }, [order])

    useEffect(() => {
        dispatch(get_seller_order(orderId))
    }, [orderId, dispatch])

    const status_update = (e) => {
        dispatch(seller_order_status_update({ orderId, info: { status: e.target.value } }))
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

    const formatPrice = (price) => {
        return Number(price).toFixed(2)
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'order_received':
                return <FaBox className='text-amber-500' />;
            case 'processing':
                return <FaSpinner className='text-blue-500 animate-spin' />;
            case 'dispatched':
                return <FaTruck className='text-purple-500' />;
            case 'delivered':
                return <FaCheckCircle className='text-emerald-500' />;
            case 'cancelled':
                return <FaTimesCircle className='text-red-500' />;
            default:
                return <FaBox className='text-gray-500' />;
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'order_received':
                return 'bg-amber-100 text-amber-700';
            case 'processing':
                return 'bg-blue-100 text-blue-700';
            case 'dispatched':
                return 'bg-purple-100 text-purple-700';
            case 'delivered':
                return 'bg-emerald-100 text-emerald-700';
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
        return statusMap[status] || status
    }

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>Order Details</h1>
                        <p className='text-gray-500'>Order #{order._id?.slice(-8)}</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadge(status)}`}>
                            {getStatusIcon(status)}
                            {formatStatus(status)}
                        </span>
                        <select
                            onChange={status_update}
                            value={status}
                            className='px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                        >
                            <option value="order_received">Order Received</option>
                            <option value="processing">Processing</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Order Info */}
                <div className='lg:col-span-2'>
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='p-6 border-b border-gray-100'>
                            <h2 className='text-lg font-bold text-gray-800'>Products</h2>
                        </div>
                        <div className='divide-y divide-gray-100'>
                            {order?.products?.map((p, i) => (
                                <div key={i} className='p-6 flex gap-4'>
                                    <div className='w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0'>
                                        <img className='w-full h-full object-cover' src={p.images[0]} alt={p.name} />
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='font-semibold text-gray-800 mb-1'>{p.name}</h3>
                                        <p className='text-sm text-gray-500 mb-2'>Brand: {p.brand}</p>
                                        <div className='flex items-center gap-4'>
                                            <span className='text-sm text-gray-600'>Qty: <span className='font-medium'>{p.quantity}</span></span>
                                            <span className='text-lg font-bold text-cyan-600'>${formatPrice(p.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className='lg:col-span-1'>
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6'>
                        <h2 className='text-lg font-bold text-gray-800 mb-4'>Order Summary</h2>

                        <div className='space-y-3 pb-4 border-b border-gray-100'>
                            <div className='flex justify-between text-gray-600'>
                                <span>Order ID</span>
                                <span className='font-medium text-gray-800'>#{order._id?.slice(-8)}</span>
                            </div>
                            <div className='flex justify-between text-gray-600'>
                                <span>Date</span>
                                <span className='font-medium text-gray-800'>{order.date}</span>
                            </div>
                            <div className='flex justify-between text-gray-600'>
                                <span>Payment</span>
                                <span className={`font-medium ${order.payment_status === 'paid' ? 'text-emerald-600' : order.payment_status === 'cod' ? 'text-amber-600' : 'text-red-600'}`}>
                                    {order.payment_status === 'cod' ? 'Cash on Delivery' : order.payment_status}
                                </span>
                            </div>
                        </div>

                        <div className='py-4 border-b border-gray-100'>
                            <h3 className='font-semibold text-gray-800 mb-2'>Delivery Info</h3>
                            <p className='text-gray-600 text-sm'>{order.shippingInfo}</p>
                        </div>

                        <div className='pt-4'>
                            <div className='flex justify-between items-center'>
                                <span className='text-lg font-bold text-gray-800'>Total</span>
                                <span className='text-2xl font-bold text-cyan-600'>${formatPrice(order.price || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

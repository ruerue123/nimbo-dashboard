import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller_order, messageClear, seller_order_status_update, update_delivery_details } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner, FaUser, FaMapMarkerAlt, FaSave } from 'react-icons/fa';
import { socket } from '../../utils/utils';

const OrderDetails = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const [status, setStatus] = useState('')

    const { order, errorMessage, successMessage, lastDeliveryUpdate } = useSelector(state => state.order)

    // Delivery details form state
    const [deliveryDetails, setDeliveryDetails] = useState({
        courierName: '',
        courierPhone: '',
        estimatedDate: '',
        estimatedTime: '',
        trackingNumber: '',
        notes: ''
    })

    useEffect(() => {
        setStatus(order?.delivery_status)
        if (order?.deliveryDetails) {
            setDeliveryDetails({
                courierName: order.deliveryDetails.courierName || '',
                courierPhone: order.deliveryDetails.courierPhone || '',
                estimatedDate: order.deliveryDetails.estimatedDate || '',
                estimatedTime: order.deliveryDetails.estimatedTime || '',
                trackingNumber: order.deliveryDetails.trackingNumber || '',
                notes: order.deliveryDetails.notes || ''
            })
        }
    }, [order])

    useEffect(() => {
        dispatch(get_seller_order(orderId))
    }, [orderId, dispatch])

    const status_update = (e) => {
        dispatch(seller_order_status_update({ orderId, info: { status: e.target.value } }))
        setStatus(e.target.value)
    }

    const handleDeliveryInput = (e) => {
        setDeliveryDetails({
            ...deliveryDetails,
            [e.target.name]: e.target.value
        })
    }

    const saveDeliveryDetails = (e) => {
        e.preventDefault()
        dispatch(update_delivery_details({ orderId, deliveryDetails }))
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

    // Emit socket event when delivery details are updated successfully
    useEffect(() => {
        if (lastDeliveryUpdate?.customerId && lastDeliveryUpdate?.deliveryDetails) {
            console.log('📦 Emitting delivery details update:', lastDeliveryUpdate)
            socket.emit('delivery_details_updated', {
                customerId: lastDeliveryUpdate.customerId,
                orderId: lastDeliveryUpdate.customerOrderId,
                deliveryDetails: lastDeliveryUpdate.deliveryDetails
            })
        }
    }, [lastDeliveryUpdate])

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

    // Parse shipping info - it might be a string or object
    const parseShippingInfo = (info) => {
        if (!info) return null
        if (typeof info === 'string') {
            try {
                return JSON.parse(info)
            } catch {
                return { address: info }
            }
        }
        return info
    }

    const shippingInfo = parseShippingInfo(order.shippingInfo)

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div>
                        <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>Order Details</h1>
                        <p className='text-gray-500 text-sm'>Order #{order._id?.slice(-8)}</p>
                    </div>
                    <div className='flex flex-wrap items-center gap-3'>
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadge(status)}`}>
                            {getStatusIcon(status)}
                            {formatStatus(status)}
                        </span>
                        <select
                            onChange={status_update}
                            value={status}
                            className='px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium focus:border-cyan-500 outline-none text-sm'
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

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
                {/* Left Column */}
                <div className='lg:col-span-2 space-y-4 sm:space-y-6'>
                    {/* Customer Info Card */}
                    {shippingInfo && (
                        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center'>
                                    <FaUser className='text-cyan-600' />
                                </div>
                                <h2 className='text-lg font-bold text-gray-800'>Customer Details</h2>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-xs text-gray-500 mb-1'>Name</p>
                                    <p className='font-medium text-gray-800'>{shippingInfo.name || order.customerName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className='text-xs text-gray-500 mb-1'>Phone</p>
                                    <p className='font-medium text-gray-800'>{shippingInfo.phone || 'N/A'}</p>
                                </div>
                                <div className='sm:col-span-2'>
                                    <p className='text-xs text-gray-500 mb-1'>Address</p>
                                    <p className='font-medium text-gray-800'>
                                        {shippingInfo.address ? `${shippingInfo.address}, ${shippingInfo.area || ''}, ${shippingInfo.city || ''}` : typeof order.shippingInfo === 'string' ? order.shippingInfo : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='p-4 sm:p-6 border-b border-gray-100'>
                            <h2 className='text-lg font-bold text-gray-800'>Products</h2>
                        </div>
                        <div className='divide-y divide-gray-100'>
                            {order?.products?.map((p, i) => (
                                <div key={i} className='p-4 sm:p-6 flex gap-4'>
                                    <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0'>
                                        <img className='w-full h-full object-cover' src={p.images[0]} alt={p.name} />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate'>{p.name}</h3>
                                        <p className='text-xs sm:text-sm text-gray-500 mb-2'>Brand: {p.brand}</p>
                                        <div className='flex items-center gap-4'>
                                            <span className='text-xs sm:text-sm text-gray-600'>Qty: <span className='font-medium'>{p.quantity}</span></span>
                                            <span className='text-base sm:text-lg font-bold text-cyan-600'>${formatPrice(p.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Details Form */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <div className='p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-purple-100'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center'>
                                    <FaTruck className='text-white' />
                                </div>
                                <div>
                                    <h2 className='text-lg font-bold text-gray-800'>Delivery Details</h2>
                                    <p className='text-xs text-gray-500'>Enter delivery information for the customer</p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={saveDeliveryDetails} className='p-4 sm:p-6 space-y-4'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Courier/Driver Name</label>
                                    <input
                                        type='text'
                                        name='courierName'
                                        value={deliveryDetails.courierName}
                                        onChange={handleDeliveryInput}
                                        placeholder='John Doe'
                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 outline-none text-sm'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Courier Phone</label>
                                    <input
                                        type='tel'
                                        name='courierPhone'
                                        value={deliveryDetails.courierPhone}
                                        onChange={handleDeliveryInput}
                                        placeholder='0771234567'
                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 outline-none text-sm'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Estimated Delivery Date</label>
                                    <input
                                        type='date'
                                        name='estimatedDate'
                                        value={deliveryDetails.estimatedDate}
                                        onChange={handleDeliveryInput}
                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 outline-none text-sm'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Estimated Time</label>
                                    <input
                                        type='time'
                                        name='estimatedTime'
                                        value={deliveryDetails.estimatedTime}
                                        onChange={handleDeliveryInput}
                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 outline-none text-sm'
                                    />
                                </div>
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 mb-1'>Tracking Number (Optional)</label>
                                <input
                                    type='text'
                                    name='trackingNumber'
                                    value={deliveryDetails.trackingNumber}
                                    onChange={handleDeliveryInput}
                                    placeholder='TRK-123456789'
                                    className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 outline-none text-sm'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 mb-1'>Delivery Notes</label>
                                <textarea
                                    name='notes'
                                    value={deliveryDetails.notes}
                                    onChange={handleDeliveryInput}
                                    placeholder='Any special delivery instructions...'
                                    rows='3'
                                    className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 outline-none text-sm resize-none'
                                />
                            </div>
                            <button
                                type='submit'
                                className='w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all text-sm'
                            >
                                <FaSave /> Save Delivery Details
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className='lg:col-span-1'>
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-6'>
                        <h2 className='text-lg font-bold text-gray-800 mb-4'>Order Summary</h2>

                        <div className='space-y-3 pb-4 border-b border-gray-100 text-sm'>
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
                                    {order.payment_status === 'cod' ? 'COD' : order.payment_status}
                                </span>
                            </div>
                        </div>

                        <div className='pt-4'>
                            <div className='flex justify-between items-center'>
                                <span className='text-base sm:text-lg font-bold text-gray-800'>Total</span>
                                <span className='text-xl sm:text-2xl font-bold text-cyan-600'>${formatPrice(order.price || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

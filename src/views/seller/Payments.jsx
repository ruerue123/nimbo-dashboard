import React, { forwardRef, useEffect, useState } from 'react';
import { FaWallet, FaDollarSign, FaArrowUp, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { get_seller_payment_details, messageClear, send_withdrowal_request } from '../../store/Reducers/PaymentReducer';
import toast from 'react-hot-toast';
import moment from 'moment';

function handleOnWheel({ deltaY }) {
    console.log('handleOnWheel', deltaY)
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
))

const Payments = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const {
        successMessage, errorMessage, loader, pendingWithdrows, successWithdrows, totalAmount, withdrowAmount, pendingAmount,
        availableAmount,
    } = useSelector(state => state.payment)

    const [amount, setAmount] = useState(0)

    const formatPrice = (price) => Number(price || 0).toFixed(2)

    const sendRequest = (e) => {
        e.preventDefault()
        if (availableAmount - amount > 10) {
            dispatch(send_withdrowal_request({ amount, sellerId: userInfo._id }))
            setAmount(0)
        } else {
            toast.error('Insufficient Balance')
        }
    }

    const Row = ({ index, style }) => {
        return (
            <div style={style} className='flex text-sm text-gray-700 font-medium border-b border-gray-100'>
                <div className='w-[25%] p-3 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[25%] p-3 whitespace-nowrap font-semibold'>${formatPrice(pendingWithdrows[index]?.amount)}</div>
                <div className='w-[25%] p-3 whitespace-nowrap'>
                    <span className='inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium'>
                        <FaClock className='text-xs' />
                        {pendingWithdrows[index]?.status}
                    </span>
                </div>
                <div className='w-[25%] p-3 whitespace-nowrap text-gray-500'>{moment(pendingWithdrows[index]?.createdAt).format('LL')}</div>
            </div>
        )
    }

    const Rows = ({ index, style }) => {
        return (
            <div style={style} className='flex text-sm text-gray-700 font-medium border-b border-gray-100'>
                <div className='w-[25%] p-3 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[25%] p-3 whitespace-nowrap font-semibold'>${formatPrice(successWithdrows[index]?.amount)}</div>
                <div className='w-[25%] p-3 whitespace-nowrap'>
                    <span className='inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium'>
                        <FaCheckCircle className='text-xs' />
                        {successWithdrows[index]?.status}
                    </span>
                </div>
                <div className='w-[25%] p-3 whitespace-nowrap text-gray-500'>{moment(successWithdrows[index]?.createdAt).format('LL')}</div>
            </div>
        )
    }

    useEffect(() => {
        dispatch(get_seller_payment_details(userInfo._id))
    }, [userInfo._id, dispatch])

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

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center'>
                    <FaWallet className='text-cyan-600 text-xl' />
                </div>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Payments</h1>
                    <p className='text-gray-500 text-sm'>Manage your earnings and withdrawals</p>
                </div>
            </div>

            {/* Stats Cards - Stack on mobile, 2 columns on tablet, 4 columns on desktop */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className='text-sm text-gray-500 mb-1'>Total Sales</p>
                            <h2 className='text-2xl font-bold text-gray-800'>${formatPrice(totalAmount)}</h2>
                        </div>
                        <div className='w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center'>
                            <FaDollarSign className='text-emerald-600' />
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className='text-sm text-gray-500 mb-1'>Available Balance</p>
                            <h2 className='text-2xl font-bold text-cyan-600'>${formatPrice(availableAmount)}</h2>
                        </div>
                        <div className='w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center'>
                            <FaWallet className='text-cyan-600' />
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className='text-sm text-gray-500 mb-1'>Withdrawn</p>
                            <h2 className='text-2xl font-bold text-gray-800'>${formatPrice(withdrowAmount)}</h2>
                        </div>
                        <div className='w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center'>
                            <FaArrowUp className='text-purple-600' />
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className='text-sm text-gray-500 mb-1'>Pending</p>
                            <h2 className='text-2xl font-bold text-amber-600'>${formatPrice(pendingAmount)}</h2>
                        </div>
                        <div className='w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center'>
                            <FaClock className='text-amber-600' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid - Stack on mobile, 2 columns on desktop */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Withdrawal Request Card */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='p-5 border-b border-gray-100'>
                        <h2 className='text-lg font-bold text-gray-800'>Request Withdrawal</h2>
                        <p className='text-sm text-gray-500 mt-1'>Minimum balance of $10 required after withdrawal</p>
                    </div>

                    <div className='p-5'>
                        <div className='mb-6'>
                            <div className='flex flex-col sm:flex-row gap-3'>
                                <div className='flex-1 relative'>
                                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>$</span>
                                    <input
                                        onChange={(e) => setAmount(e.target.value)}
                                        value={amount}
                                        min='0'
                                        type="number"
                                        className='w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                        placeholder='Enter amount'
                                    />
                                </div>
                                <button
                                    onClick={sendRequest}
                                    disabled={loader}
                                    className='px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap'
                                >
                                    {loader ? (
                                        <>
                                            <FaSpinner className='animate-spin' />
                                            Sending...
                                        </>
                                    ) : 'Withdraw'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className='text-sm font-semibold text-gray-700 mb-3'>Pending Requests</h3>
                            <div className='bg-gray-50 rounded-xl overflow-hidden'>
                                <div className='flex bg-gray-100 text-xs font-semibold text-gray-500 uppercase'>
                                    <div className='w-[25%] p-3'>No</div>
                                    <div className='w-[25%] p-3'>Amount</div>
                                    <div className='w-[25%] p-3'>Status</div>
                                    <div className='w-[25%] p-3'>Date</div>
                                </div>
                                {pendingWithdrows.length > 0 ? (
                                    <List
                                        style={{ minWidth: '100%' }}
                                        className='List'
                                        height={200}
                                        itemCount={pendingWithdrows.length}
                                        itemSize={45}
                                        outerElementType={outerElementType}
                                    >
                                        {Row}
                                    </List>
                                ) : (
                                    <div className='p-6 text-center text-gray-400 text-sm'>
                                        No pending requests
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Withdrawals Card */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='p-5 border-b border-gray-100'>
                        <h2 className='text-lg font-bold text-gray-800'>Successful Withdrawals</h2>
                        <p className='text-sm text-gray-500 mt-1'>History of completed withdrawals</p>
                    </div>

                    <div className='p-5'>
                        <div className='bg-gray-50 rounded-xl overflow-hidden'>
                            <div className='flex bg-gray-100 text-xs font-semibold text-gray-500 uppercase'>
                                <div className='w-[25%] p-3'>No</div>
                                <div className='w-[25%] p-3'>Amount</div>
                                <div className='w-[25%] p-3'>Status</div>
                                <div className='w-[25%] p-3'>Date</div>
                            </div>
                            {successWithdrows.length > 0 ? (
                                <List
                                    style={{ minWidth: '100%' }}
                                    className='List'
                                    height={320}
                                    itemCount={successWithdrows.length}
                                    itemSize={45}
                                    outerElementType={outerElementType}
                                >
                                    {Rows}
                                </List>
                            ) : (
                                <div className='p-6 text-center text-gray-400 text-sm'>
                                    No completed withdrawals yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
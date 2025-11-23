import React, { useEffect, useRef, useState } from 'react';
import { FaList, FaUser, FaPaperPlane, FaComments, FaCircle } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_customer_message, get_customers, messageClear, send_message, updateMessage } from '../../store/Reducers/chatReducer';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { socket } from '../../utils/utils';

const SellerToCustomer = () => {
    const scrollRef = useRef()
    const [show, setShow] = useState(false)
    const { userInfo } = useSelector(state => state.auth)
    const { customers, messages, currentCustomer, successMessage } = useSelector(state => state.chat)
    const [text, setText] = useState('')
    const [receverMessage, setReceverMessage] = useState('')
    const { customerId } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(get_customers(userInfo._id))
    }, [userInfo._id, dispatch])

    useEffect(() => {
        if (customerId) {
            dispatch(get_customer_message(customerId))
        }
    }, [customerId, dispatch])

    const send = (e) => {
        e.preventDefault()
        if (!text.trim()) return
        dispatch(send_message({
            senderId: userInfo._id,
            receverId: customerId,
            text,
            name: userInfo?.shopInfo?.shopName
        }))
        setText('')
    }

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_seller_message', messages[messages.length - 1])
            dispatch(messageClear())
        }
    }, [successMessage, messages, dispatch])

    useEffect(() => {
        socket.on('customer_message', msg => {
            setReceverMessage(msg)
        })
        return () => socket.off('customer_message')
    }, [])

    useEffect(() => {
        if (receverMessage) {
            if (customerId === receverMessage.senderId && userInfo._id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage))
            } else {
                toast.success(receverMessage.senderName + " sent a message")
                dispatch(messageClear())
            }
        }
    }, [receverMessage, customerId, userInfo._id, dispatch])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Format message time
    const formatTime = (date) => {
        if (!date) return ''
        const d = new Date(date)
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }

    // Format date for message grouping
    const formatDate = (date) => {
        if (!date) return ''
        const d = new Date(date)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (d.toDateString() === today.toDateString()) return 'Today'
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }

    // Group messages by date
    const groupMessagesByDate = () => {
        const groups = {}
        messages.forEach(m => {
            const date = formatDate(m.createdAt)
            if (!groups[date]) groups[date] = []
            groups[date].push(m)
        })
        return groups
    }

    const messageGroups = groupMessagesByDate()

    // Sort customers by most recent message (if they have lastMessage timestamp)
    const sortedCustomers = [...customers].sort((a, b) => {
        const dateA = a.lastMessageAt ? new Date(a.lastMessageAt) : new Date(0)
        const dateB = b.lastMessageAt ? new Date(b.lastMessageAt) : new Date(0)
        return dateB - dateA
    })

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                    <FaComments className='text-purple-600 text-xl' />
                </div>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Customer Chat</h1>
                    <p className='text-gray-500 text-sm'>{customers.length} conversations</p>
                </div>
            </div>

            {/* Chat Container */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-200px)]'>
                <div className='flex h-full relative'>
                    {/* Customer List Sidebar */}
                    <div className={`w-[300px] h-full absolute z-10 ${show ? 'left-0' : '-left-[320px]'} md:left-0 md:relative transition-all border-r border-gray-100 bg-white`}>
                        <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                            <h2 className='font-semibold text-gray-800'>Customers</h2>
                            <button onClick={() => setShow(false)} className='md:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg'>
                                <IoMdClose className='text-xl' />
                            </button>
                        </div>

                        <div className='overflow-y-auto h-[calc(100%-65px)]'>
                            {sortedCustomers.length === 0 ? (
                                <div className='flex flex-col items-center justify-center h-full text-gray-400 p-4'>
                                    <FaUser className='text-3xl mb-2' />
                                    <p className='text-sm'>No conversations yet</p>
                                </div>
                            ) : (
                                sortedCustomers.map((c, i) => (
                                    <Link
                                        key={i}
                                        to={`/seller/dashboard/chat-customer/${c.fdId}`}
                                        onClick={() => setShow(false)}
                                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${customerId === c.fdId ? 'bg-cyan-50 border-l-4 border-l-cyan-500' : ''}`}
                                    >
                                        <div className='relative'>
                                            <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold'>
                                                {c.name?.charAt(0).toUpperCase() || 'C'}
                                            </div>
                                            <FaCircle className='absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px] bg-white rounded-full' />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-medium text-gray-800 text-sm truncate'>{c.name}</h3>
                                            {c.lastMessage && (
                                                <p className='text-xs text-gray-500 truncate'>{c.lastMessage}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className='flex-1 flex flex-col'>
                        {/* Chat Header */}
                        <div className='p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50'>
                            {customerId ? (
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold'>
                                        {currentCustomer.name?.charAt(0).toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-gray-800'>{currentCustomer.name}</h3>
                                        <p className='text-xs text-green-500 flex items-center gap-1'>
                                            <FaCircle className='text-[8px]' /> Online
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className='text-gray-500 text-sm'>Select a customer to start chatting</div>
                            )}

                            <button
                                onClick={() => setShow(true)}
                                className='md:hidden w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg'
                            >
                                <FaList />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
                            {customerId ? (
                                Object.keys(messageGroups).length > 0 ? (
                                    Object.entries(messageGroups).map(([date, msgs]) => (
                                        <div key={date}>
                                            {/* Date Separator */}
                                            <div className='flex items-center justify-center my-4'>
                                                <div className='bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600'>
                                                    {date}
                                                </div>
                                            </div>

                                            {/* Messages for this date */}
                                            {msgs.map((m, i) => {
                                                const isCustomer = m.senderId === customerId
                                                return (
                                                    <div
                                                        key={i}
                                                        ref={i === msgs.length - 1 ? scrollRef : null}
                                                        className={`flex mb-3 ${isCustomer ? 'justify-start' : 'justify-end'}`}
                                                    >
                                                        <div className={`flex items-end gap-2 max-w-[75%] ${isCustomer ? '' : 'flex-row-reverse'}`}>
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${isCustomer ? 'bg-gradient-to-br from-cyan-400 to-cyan-600' : 'bg-gradient-to-br from-purple-400 to-purple-600'}`}>
                                                                {isCustomer ? currentCustomer.name?.charAt(0).toUpperCase() || 'C' : 'S'}
                                                            </div>
                                                            <div>
                                                                <div className={`px-4 py-2 rounded-2xl ${isCustomer ? 'bg-white border border-gray-200 rounded-bl-none' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-br-none'}`}>
                                                                    <p className='text-sm'>{m.message}</p>
                                                                </div>
                                                                <p className={`text-[10px] text-gray-400 mt-1 ${isCustomer ? 'text-left' : 'text-right'}`}>
                                                                    {formatTime(m.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                                        <FaComments className='text-5xl mb-3' />
                                        <p>No messages yet</p>
                                        <p className='text-sm'>Start the conversation!</p>
                                    </div>
                                )
                            ) : (
                                <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                                    <FaComments className='text-5xl mb-3' />
                                    <p className='font-medium'>Select a Customer</p>
                                    <p className='text-sm'>Choose from your customer list to start chatting</p>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        {customerId && (
                            <form onSubmit={send} className='p-4 border-t border-gray-100 bg-white'>
                                <div className='flex gap-3'>
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className='flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white outline-none transition-all text-sm'
                                        type="text"
                                        placeholder='Type your message...'
                                    />
                                    <button
                                        type='submit'
                                        disabled={!text.trim()}
                                        className='px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <FaPaperPlane className='text-sm' />
                                        <span className='hidden sm:inline'>Send</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerToCustomer;

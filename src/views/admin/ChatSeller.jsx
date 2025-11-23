import React, { useEffect, useRef, useState } from 'react';
import { FaList, FaPaperPlane, FaComments, FaCircle, FaUser } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_message, get_sellers, send_message_seller_admin, messageClear, updateSellerMessage } from '../../store/Reducers/chatReducer'
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { socket } from '../../utils/utils'

const ChatSeller = () => {
    const scrollRef = useRef()
    const [show, setShow] = useState(false)
    const { sellerId } = useParams()
    const [text, setText] = useState('')
    const [receverMessage, setReceverMessage] = useState('')

    const { sellers, activeSeller, seller_admin_message, currentSeller, successMessage } = useSelector(state => state.chat)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(get_sellers())
    }, [dispatch])

    const send = (e) => {
        e.preventDefault()
        if (text.trim()) {
            dispatch(send_message_seller_admin({
                senderId: '',
                receverId: sellerId,
                message: text,
                senderName: 'Admin Support'
            }))
            setText('')
        }
    }

    useEffect(() => {
        if (sellerId) {
            dispatch(get_admin_message(sellerId))
        }
    }, [sellerId, dispatch])

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_message_admin_to_seller', seller_admin_message[seller_admin_message.length - 1])
            dispatch(messageClear())
        }
    }, [successMessage, seller_admin_message, dispatch])

    useEffect(() => {
        socket.on('receved_seller_message', msg => {
            setReceverMessage(msg)
        })
        return () => socket.off('receved_seller_message')
    }, [])

    useEffect(() => {
        if (receverMessage) {
            if (receverMessage.senderId === sellerId && receverMessage.receverId === '') {
                dispatch(updateSellerMessage(receverMessage))
            } else {
                toast.success(receverMessage.senderName + " sent a message")
                dispatch(messageClear())
            }
        }
    }, [receverMessage, sellerId, dispatch])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [seller_admin_message])

    const isSellerOnline = (id) => activeSeller.some(a => a.sellerId === id)

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <div className='px-4 lg:px-6 py-5'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-140px)]'>
                <div className='flex w-full h-full relative'>

                    {/* Sellers Sidebar */}
                    <div className={`w-[280px] h-full absolute z-10 ${show ? 'left-0' : '-left-[300px]'} md:left-0 md:relative transition-all border-r border-gray-100 bg-white`}>
                        <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <FaComments className='text-cyan-500' />
                                <h2 className='font-semibold text-gray-800'>Sellers</h2>
                            </div>
                            <button onClick={() => setShow(false)} className='md:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg'>
                                <IoMdClose className='text-xl' />
                            </button>
                        </div>

                        <div className='overflow-y-auto h-[calc(100%-65px)]'>
                            {sellers.length === 0 ? (
                                <div className='flex flex-col items-center justify-center h-full text-gray-400 p-4'>
                                    <FaUser className='text-3xl mb-2' />
                                    <p className='text-sm text-center'>No sellers available</p>
                                </div>
                            ) : (
                                sellers.map((s, i) => (
                                    <Link
                                        key={i}
                                        to={`/admin/dashboard/chat-sellers/${s._id}`}
                                        onClick={() => setShow(false)}
                                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${sellerId === s._id ? 'bg-cyan-50 border-l-4 border-l-cyan-500' : ''}`}
                                    >
                                        <div className='relative'>
                                            <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center overflow-hidden'>
                                                {s.image ? (
                                                    <img src={s.image} alt={s.name} className='w-full h-full object-cover' />
                                                ) : (
                                                    <span className='text-white font-semibold'>{s.name?.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            {isSellerOnline(s._id) && (
                                                <FaCircle className='absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px] bg-white rounded-full' />
                                            )}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-medium text-gray-800 text-sm truncate'>{s.name}</h3>
                                            <p className='text-xs text-gray-500'>{isSellerOnline(s._id) ? 'Online' : 'Offline'}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className='flex-1 flex flex-col'>
                        {sellerId ? (
                            <>
                                {/* Chat Header */}
                                <div className='p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50'>
                                    <div className='flex items-center gap-3'>
                                        <div className='relative'>
                                            <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center overflow-hidden'>
                                                {currentSeller?.image ? (
                                                    <img src={currentSeller.image} alt={currentSeller.name} className='w-full h-full object-cover' />
                                                ) : (
                                                    <span className='text-white font-semibold'>{currentSeller?.name?.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            {isSellerOnline(sellerId) && (
                                                <FaCircle className='absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px] bg-white rounded-full' />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-gray-800'>{currentSeller?.name}</h3>
                                            <p className={`text-xs flex items-center gap-1 ${isSellerOnline(sellerId) ? 'text-green-500' : 'text-gray-400'}`}>
                                                <FaCircle className='text-[6px]' />
                                                {isSellerOnline(sellerId) ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShow(true)}
                                        className='md:hidden w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg'
                                    >
                                        <FaList />
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
                                    {seller_admin_message.length === 0 ? (
                                        <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                                            <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                                <FaComments className='text-3xl' />
                                            </div>
                                            <p className='font-medium mb-2'>Start a conversation</p>
                                            <p className='text-sm text-center'>Send a message to {currentSeller?.name}</p>
                                        </div>
                                    ) : (
                                        seller_admin_message.map((m, i) => {
                                            const isFromSeller = m.senderId === sellerId;
                                            return (
                                                <div
                                                    key={i}
                                                    ref={i === seller_admin_message.length - 1 ? scrollRef : null}
                                                    className={`flex mb-3 ${isFromSeller ? 'justify-start' : 'justify-end'}`}
                                                >
                                                    <div className={`flex items-end gap-2 max-w-[75%] ${isFromSeller ? '' : 'flex-row-reverse'}`}>
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 overflow-hidden ${isFromSeller ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-cyan-400 to-cyan-600'}`}>
                                                            {isFromSeller ? (
                                                                currentSeller?.image ? (
                                                                    <img src={currentSeller.image} alt="" className='w-full h-full object-cover' />
                                                                ) : currentSeller?.name?.charAt(0).toUpperCase()
                                                            ) : 'A'}
                                                        </div>
                                                        <div>
                                                            <div className={`px-4 py-2 rounded-2xl ${isFromSeller ? 'bg-white border border-gray-200 rounded-bl-none text-gray-800' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-br-none'}`}>
                                                                <p className='text-sm'>{m.message}</p>
                                                            </div>
                                                            <p className={`text-[10px] text-gray-400 mt-1 ${isFromSeller ? 'text-left' : 'text-right'}`}>
                                                                {formatTime(m.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Message Input */}
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
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className='flex-1 flex flex-col items-center justify-center text-gray-400 p-6'>
                                <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                    <FaComments className='text-4xl' />
                                </div>
                                <p className='font-medium text-lg mb-2'>Live Chat</p>
                                <p className='text-sm text-center mb-6 max-w-[280px]'>
                                    Select a seller from the list to start a conversation or respond to their messages.
                                </p>
                                <button
                                    onClick={() => setShow(true)}
                                    className='md:hidden flex items-center gap-2 px-4 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-medium'
                                >
                                    <FaList /> View Sellers
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatSeller;

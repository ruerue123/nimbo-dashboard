import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_message, send_message_seller_admin, updateAdminMessage, messageClear } from '../../store/Reducers/chatReducer';
import { socket } from '../../utils/utils';
import { FaPaperPlane, FaHeadset, FaCircle, FaComments } from 'react-icons/fa';

const SellerToAdmin = () => {
    const scrollRef = useRef();
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const { seller_admin_message, successMessage } = useSelector(state => state.chat);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(get_seller_message());
    }, [dispatch]);

    const send = (e) => {
        e.preventDefault();
        if (text.trim()) {
            dispatch(send_message_seller_admin({
                senderId: userInfo._id,
                receverId: '',
                message: text,
                senderName: userInfo.name
            }));
            setText('');
        }
    };

    useEffect(() => {
        socket.on('receved_admin_message', msg => {
            dispatch(updateAdminMessage(msg));
        });
        return () => socket.off('receved_admin_message');
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_message_seller_to_admin', seller_admin_message[seller_admin_message.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage, seller_admin_message, dispatch]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [seller_admin_message]);

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <div className='px-4 lg:px-6 py-5'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-140px)]'>
                {/* Chat Header */}
                <div className='p-4 border-b border-gray-100 bg-gradient-to-r from-cyan-500 to-cyan-600'>
                    <div className='flex items-center gap-3'>
                        <div className='relative'>
                            <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg'>
                                <FaHeadset className='text-cyan-600 text-xl' />
                            </div>
                            <FaCircle className='absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px] bg-white rounded-full' />
                        </div>
                        <div>
                            <h2 className='font-bold text-white text-lg'>Admin Support</h2>
                            <p className='text-cyan-100 text-sm flex items-center gap-1'>
                                <FaCircle className='text-[6px] text-green-400' /> Online - Ready to help
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className='h-[calc(100%-140px)] overflow-y-auto p-4 bg-gray-50'>
                    {seller_admin_message.length === 0 ? (
                        <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                            <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                <FaComments className='text-3xl' />
                            </div>
                            <p className='font-medium text-gray-600 mb-2'>Start a conversation</p>
                            <p className='text-sm text-center max-w-[280px]'>
                                Need help? Send us a message and our support team will get back to you.
                            </p>
                        </div>
                    ) : (
                        seller_admin_message.map((m, i) => {
                            const isFromSeller = userInfo._id === m.senderId;
                            return (
                                <div
                                    key={i}
                                    ref={i === seller_admin_message.length - 1 ? scrollRef : null}
                                    className={`flex mb-3 ${isFromSeller ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-end gap-2 max-w-[75%] ${isFromSeller ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 overflow-hidden ${isFromSeller ? 'bg-gradient-to-br from-cyan-400 to-cyan-600' : 'bg-gradient-to-br from-purple-400 to-purple-600'}`}>
                                            {isFromSeller ? (
                                                userInfo?.image ? (
                                                    <img src={userInfo.image} alt="" className='w-full h-full object-cover' />
                                                ) : userInfo?.name?.charAt(0).toUpperCase()
                                            ) : (
                                                <FaHeadset className='text-sm' />
                                            )}
                                        </div>
                                        <div>
                                            <div className={`px-4 py-2 rounded-2xl ${isFromSeller
                                                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-br-none'
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                                }`}>
                                                <p className='text-sm'>{m.message}</p>
                                            </div>
                                            <p className={`text-[10px] text-gray-400 mt-1 ${isFromSeller ? 'text-right' : 'text-left'}`}>
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
            </div>
        </div>
    );
};

export default SellerToAdmin;

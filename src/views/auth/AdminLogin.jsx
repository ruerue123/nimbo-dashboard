import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);

    const [state, setState] = useState({
        email: "",
        password: ""
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(admin_login(state));
    };

    const overrideStyle = {
        display: 'flex',
        margin: '0 auto',
        height: '24px',
        justifyContent: 'center',
        alignItems: 'center'
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/');
        }
    }, [errorMessage, successMessage, dispatch, navigate]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center p-4'>
            <div className='w-full max-w-md'>
                {/* Card */}
                <div className='bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700'>
                    {/* Logo */}
                    <div className='flex justify-center mb-8'>
                        <img className='h-12 object-contain' src={logo} alt="Logo" />
                    </div>

                    {/* Header */}
                    <div className='text-center mb-8'>
                        <h2 className='text-2xl font-bold text-white mb-2'>Admin Portal</h2>
                        <p className='text-gray-400'>Sign in to access the admin dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className='space-y-5'>
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-300 mb-2'>
                                Email Address
                            </label>
                            <input
                                onChange={inputHandle}
                                value={state.email}
                                className='w-full px-4 py-3 outline-none bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                type="email"
                                name='email'
                                placeholder='Enter admin email'
                                id='email'
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-300 mb-2'>
                                Password
                            </label>
                            <input
                                onChange={inputHandle}
                                value={state.password}
                                className='w-full px-4 py-3 outline-none bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                type="password"
                                name='password'
                                placeholder='Enter password'
                                id='password'
                                required
                            />
                        </div>

                        <button
                            disabled={loader}
                            className='w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all disabled:opacity-70'
                        >
                            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sign In'}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className='mt-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600'>
                        <p className='text-xs text-gray-400 text-center'>
                            This is a secure admin area. Unauthorized access attempts will be logged.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

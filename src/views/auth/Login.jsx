import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { seller_login, messageClear } from '../../store/Reducers/authReducer';
import logo from '../../assets/logo.png';

const Login = () => {
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
        dispatch(seller_login(state));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, navigate]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4'>
            <div className='w-full max-w-md'>
                {/* Card */}
                <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                    {/* Logo */}
                    <div className='flex justify-center mb-8'>
                        <img className='h-12 object-contain' src={logo} alt="Logo" />
                    </div>

                    {/* Header */}
                    <div className='text-center mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back</h2>
                        <p className='text-gray-500'>Sign in to your seller account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className='space-y-5'>
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                                Email Address
                            </label>
                            <input
                                onChange={inputHandle}
                                value={state.email}
                                className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                type="email"
                                name='email'
                                placeholder='Enter your email'
                                id='email'
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
                                Password
                            </label>
                            <input
                                onChange={inputHandle}
                                value={state.password}
                                className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                type="password"
                                name='password'
                                placeholder='Enter your password'
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

                    {/* Footer */}
                    <div className='mt-8 text-center'>
                        <p className='text-gray-600'>
                            Don't have an account?{' '}
                            <Link to="/register" className='text-cyan-600 font-semibold hover:text-cyan-700 transition-colors'>
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Admin Link */}
                <div className='mt-6 text-center'>
                    <Link to="/admin/login" className='text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                        Admin Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

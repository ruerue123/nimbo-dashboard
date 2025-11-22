import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { seller_register, messageClear } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector(state => state.auth);

    const [state, setState] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [agreed, setAgreed] = useState(false);

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!agreed) {
            toast.error('Please agree to the terms and conditions');
            return;
        }
        dispatch(seller_register(state));
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
                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Create Account</h2>
                        <p className='text-gray-500'>Start selling with us today</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className='space-y-5'>
                        <div>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-2'>
                                Full Name
                            </label>
                            <input
                                onChange={inputHandle}
                                value={state.name}
                                className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                type="text"
                                name='name'
                                placeholder='Enter your full name'
                                id='name'
                                required
                            />
                        </div>

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
                                placeholder='Create a password'
                                id='password'
                                required
                            />
                        </div>

                        <div className='flex items-start gap-3'>
                            <input
                                className='w-5 h-5 mt-0.5 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 cursor-pointer'
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                id="terms"
                            />
                            <label htmlFor="terms" className='text-sm text-gray-600 cursor-pointer'>
                                I agree to the{' '}
                                <span className='text-cyan-600 hover:text-cyan-700'>Terms of Service</span>
                                {' '}and{' '}
                                <span className='text-cyan-600 hover:text-cyan-700'>Privacy Policy</span>
                            </label>
                        </div>

                        <button
                            disabled={loader}
                            className='w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all disabled:opacity-70'
                        >
                            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Create Account'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className='mt-8 text-center'>
                        <p className='text-gray-600'>
                            Already have an account?{' '}
                            <Link to="/login" className='text-cyan-600 font-semibold hover:text-cyan-700 transition-colors'>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

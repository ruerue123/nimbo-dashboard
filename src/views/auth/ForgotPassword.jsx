import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import api from '../../api/api';
import logo from '../../assets/logo.png';

// Single forgot-password page for both seller and admin. Pre-selects the role
// based on `?role=admin` in the URL when linked from the AdminLogin page.
const ForgotPassword = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'seller';

    const [email, setEmail] = useState('');
    const [role, setRole] = useState(initialRole);
    const [loader, setLoader] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            const { data } = await api.post('/forgot-password', { email, role });
            toast.success(data?.message || 'Check your email for a reset link.');
            setSubmitted(true);
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Something went wrong. Try again.');
        } finally {
            setLoader(false);
        }
    };

    const overrideStyle = {
        display: 'flex', margin: '0 auto', height: '24px',
        justifyContent: 'center', alignItems: 'center'
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4'>
            <div className='w-full max-w-md'>
                <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                    <div className='flex justify-center mb-8'>
                        <img className='h-12 object-contain' src={logo} alt="Logo" />
                    </div>
                    <div className='text-center mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Forgot password?</h2>
                        <p className='text-gray-500'>We'll send a reset link to your email.</p>
                    </div>

                    {submitted ? (
                        <div className='text-center space-y-4'>
                            <p className='text-gray-700'>
                                If an account exists for <span className='font-semibold'>{email}</span>, a reset link is on its way. The link expires in 1 hour.
                            </p>
                            <Link to={role === 'admin' ? '/admin/login' : '/login'} className='inline-block text-cyan-600 font-semibold hover:text-cyan-700'>
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={submit} className='space-y-5'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Account type</label>
                                <div className='flex gap-2'>
                                    <button
                                        type='button'
                                        onClick={() => setRole('seller')}
                                        className={`flex-1 py-2.5 rounded-xl border font-medium transition-all ${role === 'seller' ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Seller
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => setRole('admin')}
                                        className={`flex-1 py-2.5 rounded-xl border font-medium transition-all ${role === 'admin' ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                <input
                                    id='email'
                                    type='email'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='you@example.com'
                                    className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                />
                            </div>
                            <button
                                type='submit'
                                disabled={loader}
                                className='w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all disabled:opacity-70'
                            >
                                {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Send reset link'}
                            </button>
                            <div className='text-center'>
                                <Link to={role === 'admin' ? '/admin/login' : '/login'} className='text-cyan-600 font-medium hover:text-cyan-700 text-sm'>
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

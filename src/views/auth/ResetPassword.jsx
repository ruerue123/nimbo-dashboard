import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import api from '../../api/api';
import logo from '../../assets/logo.png';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';
    const role = searchParams.get('role') || 'seller';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loader, setLoader] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error('Reset token is missing from the URL.');
            return;
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoader(true);
        try {
            const { data } = await api.post('/reset-password', { token, role, new_password: password });
            toast.success(data?.message || 'Password updated. You can sign in now.');
            navigate(role === 'admin' ? '/admin/login' : '/login');
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Reset failed. Request a new link.');
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
                        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Choose a new password</h2>
                        <p className='text-gray-500'>Enter and confirm your new password.</p>
                    </div>
                    <form onSubmit={submit} className='space-y-5'>
                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>New password</label>
                            <input
                                id='password'
                                type='password'
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='At least 8 characters'
                                className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                            />
                        </div>
                        <div>
                            <label htmlFor='confirm' className='block text-sm font-medium text-gray-700 mb-2'>Confirm password</label>
                            <input
                                id='confirm'
                                type='password'
                                required
                                minLength={8}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder='Re-enter your password'
                                className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={loader}
                            className='w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all disabled:opacity-70'
                        >
                            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Reset password'}
                        </button>
                        <div className='text-center'>
                            <Link to={role === 'admin' ? '/admin/login' : '/login'} className='text-cyan-600 font-medium hover:text-cyan-700 text-sm'>
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

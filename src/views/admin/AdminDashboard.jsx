import React, { useEffect, useState } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';

// Dynamically import Chart only on client side
let Chart = null;
if (typeof window !== 'undefined') {
    Chart = require('react-apexcharts').default;
}

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { totalSale, totalOrder, totalProduct, totalSeller, recentOrder, recentMessage } = useSelector(state => state.dashboard);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(get_admin_dashboard_data());
    }, [dispatch]);

    const chartOptions = {
        series: [
            { name: "Orders", data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45] },
            { name: "Revenue", data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78] },
            { name: "Sellers", data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56] },
        ],
        options: {
            colors: ['#06b6d4', '#8b5cf6', '#10b981'],
            plotOptions: {
                bar: {
                    borderRadius: 6,
                    columnWidth: '60%',
                }
            },
            chart: {
                background: 'transparent',
                foreColor: '#6b7280',
                toolbar: { show: false }
            },
            dataLabels: { enabled: false },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: {
                    formatter: (val) => `$${val}`
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
            },
            fill: { opacity: 1 },
            grid: {
                borderColor: '#e5e7eb',
                strokeDashArray: 4,
            },
            tooltip: {
                y: { formatter: (val) => `$${val}` }
            }
        }
    };

    const statCards = [
        { title: 'Total Sales', value: `$${totalSale}`, icon: MdCurrencyExchange, iconBg: 'bg-cyan-600' },
        { title: 'Products', value: totalProduct, icon: MdProductionQuantityLimits, iconBg: 'bg-violet-600' },
        { title: 'Sellers', value: totalSeller, icon: FaUsers, iconBg: 'bg-emerald-600' },
        { title: 'Orders', value: totalOrder, icon: FaCartShopping, iconBg: 'bg-amber-600' },
    ];

    return (
        <div className='px-2 sm:px-4 md:px-6 py-4 sm:py-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5'>
                {statCards.map((card, index) => (
                    <div key={index} className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-gray-500 text-xs sm:text-sm font-medium mb-1'>{card.title}</p>
                                <h2 className='text-xl sm:text-3xl font-bold text-gray-800'>{card.value}</h2>
                            </div>
                            <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg`}>
                                <card.icon className='text-white text-sm sm:text-xl' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart & Messages Row */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 mt-4 sm:mt-6'>
                {/* Chart */}
                <div className='lg:col-span-7'>
                    <div className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100'>
                        <h2 className='text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4'>Platform Overview</h2>
                        <div className='w-full overflow-x-auto'>
                            <div className='min-w-[300px]'>
                                {Chart ? (
                                    <Chart options={chartOptions.options} series={chartOptions.series} type='bar' height={300} width="100%" />
                                ) : (
                                    <div className='h-[300px] flex items-center justify-center text-gray-400'>Loading chart...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Messages */}
                <div className='lg:col-span-5'>
                    <div className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 h-full'>
                        <div className='flex justify-between items-center mb-3 sm:mb-4'>
                            <h2 className='text-base sm:text-lg font-bold text-gray-800'>Seller Messages</h2>
                            <Link to='/admin/dashboard/chat-sellers' className='text-xs sm:text-sm text-cyan-600 hover:text-cyan-700 font-medium'>View All</Link>
                        </div>

                        <div className='space-y-3 sm:space-y-4 max-h-[280px] sm:max-h-[340px] overflow-y-auto'>
                            {recentMessage.length > 0 ? recentMessage.map((m, i) => (
                                <div key={i} className='flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'>
                                    <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-r from-cyan-500 to-cyan-600'>
                                        {m.senderId === userInfo._id ? (
                                            <div className='w-full h-full flex items-center justify-center text-white font-bold text-xs sm:text-base'>
                                                A
                                            </div>
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center text-white font-bold text-xs sm:text-base'>
                                                {m.senderName?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex justify-between items-center mb-1'>
                                            <span className='font-medium text-gray-800 text-xs sm:text-sm'>{m.senderName}</span>
                                            <span className='text-[10px] sm:text-xs text-gray-400'>{moment(m.createdAt).fromNow()}</span>
                                        </div>
                                        <p className='text-xs sm:text-sm text-gray-600 truncate'>{m.message}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className='text-center py-6 sm:py-8 text-gray-400'>
                                    <p className='text-sm'>No messages yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className='mt-4 sm:mt-6'>
                <div className='bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex justify-between items-center'>
                        <h2 className='text-base sm:text-lg font-bold text-gray-800'>Recent Orders</h2>
                        <Link to='/admin/dashboard/orders' className='text-xs sm:text-sm text-cyan-600 hover:text-cyan-700 font-medium'>View All</Link>
                    </div>

                    {/* Mobile Card View */}
                    <div className='block sm:hidden p-3 space-y-3'>
                        {recentOrder.map((order, i) => (
                            <div key={i} className='bg-gray-50 rounded-lg p-3'>
                                <div className='flex justify-between items-center mb-2'>
                                    <span className='text-sm font-medium text-gray-800'>#{order._id.slice(-8)}</span>
                                    <span className='text-sm font-semibold text-gray-800'>${order.price}</span>
                                </div>
                                <div className='flex gap-2 mb-2'>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                        order.payment_status === 'paid'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {order.payment_status}
                                    </span>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                        order.delivery_status === 'delivered'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : order.delivery_status === 'pending'
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {order.delivery_status}
                                    </span>
                                </div>
                                <Link
                                    to={`/admin/dashboard/order/details/${order._id}`}
                                    className='text-cyan-600 hover:text-cyan-700 text-xs font-medium'
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                        {recentOrder.length === 0 && (
                            <div className='text-center py-6 text-gray-400'>
                                <p className='text-sm'>No orders yet</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className='hidden sm:block overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Order ID</th>
                                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price</th>
                                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Payment</th>
                                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th>
                                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Action</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {recentOrder.map((order, i) => (
                                    <tr key={i} className='hover:bg-gray-50 transition-colors'>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className='text-sm font-medium text-gray-800'>#{order._id.slice(-8)}</span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className='text-sm font-semibold text-gray-800'>${order.price}</span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                                order.payment_status === 'paid'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                                order.delivery_status === 'delivered'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : order.delivery_status === 'pending'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {order.delivery_status}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <Link
                                                to={`/admin/dashboard/order/details/${order._id}`}
                                                className='text-cyan-600 hover:text-cyan-700 text-sm font-medium'
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {recentOrder.length === 0 && (
                            <div className='text-center py-8 text-gray-400'>
                                <p>No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

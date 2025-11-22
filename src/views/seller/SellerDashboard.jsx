import React, { useEffect } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaCartShopping, FaClock } from "react-icons/fa6";
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { totalSale, totalOrder, totalProduct, totalPendingOrder, recentOrder, recentMessage } = useSelector(state => state.dashboard);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(get_seller_dashboard_data());
    }, [dispatch]);

    const chartOptions = {
        series: [
            { name: "Orders", data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45] },
            { name: "Revenue", data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78] },
            { name: "Sales", data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56] },
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
        { title: 'Total Sales', value: `$${totalSale}`, icon: MdCurrencyExchange, gradient: 'from-cyan-500 to-cyan-600', iconBg: 'bg-cyan-600' },
        { title: 'Products', value: totalProduct, icon: MdProductionQuantityLimits, gradient: 'from-violet-500 to-violet-600', iconBg: 'bg-violet-600' },
        { title: 'Orders', value: totalOrder, icon: FaCartShopping, gradient: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-600' },
        { title: 'Pending Orders', value: totalPendingOrder, icon: FaClock, gradient: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-600' },
    ];

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                {statCards.map((card, index) => (
                    <div key={index} className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-gray-500 text-sm font-medium mb-1'>{card.title}</p>
                                <h2 className='text-3xl font-bold text-gray-800'>{card.value}</h2>
                            </div>
                            <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg`}>
                                <card.icon className='text-white text-xl' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart & Messages Row */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6'>
                {/* Chart */}
                <div className='lg:col-span-7'>
                    <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                        <h2 className='text-lg font-bold text-gray-800 mb-4'>Revenue Overview</h2>
                        <Chart options={chartOptions.options} series={chartOptions.series} type='bar' height={350} />
                    </div>
                </div>

                {/* Recent Messages */}
                <div className='lg:col-span-5'>
                    <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold text-gray-800'>Recent Messages</h2>
                            <Link to='/seller/dashboard/chat-customer' className='text-sm text-cyan-600 hover:text-cyan-700 font-medium'>View All</Link>
                        </div>

                        <div className='space-y-4 max-h-[340px] overflow-y-auto'>
                            {recentMessage.length > 0 ? recentMessage.map((m, i) => (
                                <div key={i} className='flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'>
                                    <div className='w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-r from-cyan-500 to-cyan-600'>
                                        {m.senderId === userInfo._id ? (
                                            userInfo.image ? (
                                                <img className='w-full h-full object-cover' src={userInfo.image} alt="" />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-white font-bold'>
                                                    {userInfo.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center text-white font-bold'>
                                                {m.senderName?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex justify-between items-center mb-1'>
                                            <span className='font-medium text-gray-800 text-sm'>{m.senderName}</span>
                                            <span className='text-xs text-gray-400'>{moment(m.createdAt).fromNow()}</span>
                                        </div>
                                        <p className='text-sm text-gray-600 truncate'>{m.message}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className='text-center py-8 text-gray-400'>
                                    <p>No messages yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className='mt-6'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center'>
                        <h2 className='text-lg font-bold text-gray-800'>Recent Orders</h2>
                        <Link to='/seller/dashboard/orders' className='text-sm text-cyan-600 hover:text-cyan-700 font-medium'>View All</Link>
                    </div>

                    <div className='overflow-x-auto'>
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
                                                to={`/seller/dashboard/order/details/${order._id}`}
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

export default SellerDashboard;

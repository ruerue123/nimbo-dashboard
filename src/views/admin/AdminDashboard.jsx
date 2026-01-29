import { useEffect } from 'react';
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
                    borderRadius: 4,
                    columnWidth: '55%',
                }
            },
            chart: {
                background: 'transparent',
                foreColor: '#6b7280',
                toolbar: { show: false },
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
                axisTicks: { show: false },
                labels: {
                    style: {
                        fontSize: '11px',
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: (val) => `$${val}`,
                    style: {
                        fontSize: '11px',
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '12px',
                markers: {
                    width: 10,
                    height: 10,
                    radius: 2,
                },
                itemMargin: {
                    horizontal: 10,
                }
            },
            fill: { opacity: 1 },
            grid: {
                borderColor: '#e5e7eb',
                strokeDashArray: 0,
                padding: {
                    left: 0,
                    right: 0,
                }
            },
            tooltip: {
                y: { formatter: (val) => `$${val}` }
            },
            responsive: [{
                breakpoint: 640,
                options: {
                    chart: {
                        height: 280
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: '70%',
                        }
                    },
                    xaxis: {
                        labels: {
                            style: {
                                fontSize: '10px',
                            },
                            rotate: 0,
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                fontSize: '10px',
                            }
                        }
                    },
                    legend: {
                        fontSize: '11px',
                        markers: {
                            width: 8,
                            height: 8,
                        },
                        itemMargin: {
                            horizontal: 6,
                        }
                    }
                }
            }]
        }
    };

    const statCards = [
        { title: 'Total Sales', value: `$${totalSale}`, icon: MdCurrencyExchange, iconBg: 'bg-cyan-500' },
        { title: 'Products', value: totalProduct, icon: MdProductionQuantityLimits, iconBg: 'bg-violet-500' },
        { title: 'Sellers', value: totalSeller, icon: FaUsers, iconBg: 'bg-emerald-500' },
        { title: 'Orders', value: totalOrder, icon: FaCartShopping, iconBg: 'bg-amber-500' },
    ];

    // Avatar colors for messages
    const avatarColors = [
        'from-rose-400 to-rose-500',
        'from-emerald-400 to-emerald-500',
        'from-cyan-400 to-cyan-500',
        'from-violet-400 to-violet-500',
        'from-amber-400 to-amber-500',
    ];

    const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

    return (
        <div className='px-4 md:px-6 py-4 pb-8 w-full min-w-0'>
            {/* Stats Cards - 2x2 grid on mobile */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className='bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100'
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <div className='flex justify-between items-start'>
                            <div className='flex-1 min-w-0'>
                                <p className='text-gray-500 text-xs sm:text-sm font-medium mb-1 truncate'>{card.title}</p>
                                <h2 className='text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate'>{card.value}</h2>
                            </div>
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 ml-2`}>
                                <card.icon className='text-white text-lg sm:text-xl' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Platform Overview Chart */}
            <div className='mt-4'>
                <div className='bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100'>
                    <h2 className='text-base sm:text-lg font-bold text-gray-800 mb-4'>Platform Overview</h2>
                    <div className='w-full' style={{ WebkitOverflowScrolling: 'touch' }}>
                        {Chart ? (
                            <Chart
                                options={chartOptions.options}
                                series={chartOptions.series}
                                type='bar'
                                height={300}
                                width="100%"
                            />
                        ) : (
                            <div className='h-[300px] flex items-center justify-center text-gray-400'>Loading chart...</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Seller Messages */}
            <div className='mt-4'>
                <div className='bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-base sm:text-lg font-bold text-gray-800'>Seller Messages</h2>
                        <Link
                            to='/admin/dashboard/chat-sellers'
                            className='text-sm text-cyan-500 hover:text-cyan-600 font-medium'
                        >
                            View All
                        </Link>
                    </div>

                    <div className='space-y-3 max-h-[320px] overflow-y-auto' style={{ WebkitOverflowScrolling: 'touch' }}>
                        {recentMessage.length > 0 ? recentMessage.map((m, i) => (
                            <div
                                key={i}
                                className='flex items-start gap-3 py-2'
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br ${
                                    m.senderId === userInfo._id ? 'from-emerald-400 to-emerald-500' : getAvatarColor(i)
                                } flex items-center justify-center`}>
                                    <span className='text-white font-semibold text-sm'>
                                        {m.senderId === userInfo._id ? 'A' : m.senderName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex justify-between items-center gap-2'>
                                        <span className='font-semibold text-gray-800 text-sm truncate'>{m.senderName}</span>
                                        <span className='text-xs text-gray-400 flex-shrink-0'>{moment(m.createdAt).fromNow()}</span>
                                    </div>
                                    <p className='text-sm text-gray-500 truncate mt-0.5'>{m.message}</p>
                                </div>
                            </div>
                        )) : (
                            <div className='text-center py-8 text-gray-400'>
                                <p className='text-sm'>No messages yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders - Hidden on very small screens to match the design */}
            <div className='mt-4 hidden sm:block'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center'>
                        <h2 className='text-base sm:text-lg font-bold text-gray-800'>Recent Orders</h2>
                        <Link to='/admin/dashboard/orders' className='text-sm text-cyan-500 hover:text-cyan-600 font-medium'>View All</Link>
                    </div>

                    {/* Desktop Table View */}
                    <div className='overflow-x-auto' style={{ WebkitOverflowScrolling: 'touch' }}>
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
                                                className='text-cyan-500 hover:text-cyan-600 text-sm font-medium'
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

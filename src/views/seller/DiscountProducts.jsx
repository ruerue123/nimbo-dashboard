import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaEye, FaTrash, FaTag, FaSearch, FaPercent } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productReducer';

const DiscountProducts = () => {
    const dispatch = useDispatch()
    const { products, totalProduct } = useSelector(state => state.product)
    const { userInfo } = useSelector(state => state.auth)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(10)

    // Filter products with discounts
    const discountProducts = products.filter(p => p.discount > 0)

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            sellerId: userInfo._id
        }
        dispatch(get_products(obj))
    }, [searchValue, currentPage, parPage, userInfo._id, dispatch])

    const formatPrice = (price) => Number(price).toFixed(2)

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
                    <FaPercent className='text-orange-600 text-xl' />
                </div>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Discount Products</h1>
                    <p className='text-gray-500 text-sm'>{discountProducts.length} products on sale</p>
                </div>
            </div>

            {/* Main Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                {/* Search & Filter Bar */}
                <div className='p-4 border-b border-gray-100'>
                    <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                        <div className='relative w-full sm:w-80'>
                            <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                            <input
                                type="text"
                                placeholder='Search discount products...'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className='w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                            />
                        </div>
                        <div className='flex items-center gap-3'>
                            <span className='text-sm text-gray-500'>Show:</span>
                            <select
                                value={parPage}
                                onChange={(e) => setParPage(e.target.value)}
                                className='px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>No</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Product</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Category</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Discount</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Sale Price</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Stock</th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {discountProducts.map((d, i) => (
                                <tr key={i} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm font-medium text-gray-800'>{i + 1}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-12 h-12 bg-gray-100 rounded-lg overflow-hidden'>
                                                <img
                                                    className='w-full h-full object-cover'
                                                    src={d.images[0]}
                                                    alt={d.name}
                                                />
                                            </div>
                                            <div>
                                                <p className='text-sm font-medium text-gray-800 truncate max-w-[200px]'>{d.name}</p>
                                                <p className='text-xs text-gray-500'>{d.brand}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm text-gray-600'>{d.category}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm text-gray-400 line-through'>${formatPrice(d.price)}</span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700'>
                                            <FaTag className='text-xs' />
                                            {d.discount}% OFF
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm font-semibold text-emerald-600'>
                                            ${formatPrice(d.price - (d.price * d.discount / 100))}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${d.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {d.stock > 0 ? `${d.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center gap-2'>
                                            <Link
                                                to={`/seller/dashboard/edit-product/${d._id}`}
                                                className='p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors'
                                            >
                                                <FaEdit className='text-sm' />
                                            </Link>
                                            <Link
                                                to={`/seller/dashboard/product/${d._id}`}
                                                className='p-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors'
                                            >
                                                <FaEye className='text-sm' />
                                            </Link>
                                            <button
                                                className='p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors'
                                            >
                                                <FaTrash className='text-sm' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {discountProducts.length === 0 && (
                        <div className='text-center py-12'>
                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <FaPercent className='text-2xl text-gray-400' />
                            </div>
                            <p className='text-gray-500 mb-2'>No discount products yet</p>
                            <p className='text-sm text-gray-400'>Add discounts to your products to see them here</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalProduct > parPage && (
                    <div className='p-4 border-t border-gray-100 flex justify-end'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalProduct}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountProducts;

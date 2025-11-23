import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaTrash, FaBox, FaPlus, FaSearch, FaImage } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productReducer';

const Products = () => {
    const dispatch = useDispatch()
    const { products, totalProduct } = useSelector(state => state.product)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(10)

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_products(obj))
    }, [searchValue, currentPage, parPage, dispatch])

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center'>
                        <FaBox className='text-violet-600 text-xl' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>All Products</h1>
                        <p className='text-gray-500 text-sm'>{totalProduct} products in your inventory</p>
                    </div>
                </div>
                <Link
                    to='/seller/dashboard/add-product'
                    className='inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 font-medium'
                >
                    <FaPlus className='text-sm' />
                    Add Product
                </Link>
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
                                placeholder='Search products...'
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
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>#</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Product</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Category</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Brand</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Discount</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Stock</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {products.map((d, i) => (
                                <tr key={i} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-4 py-3 whitespace-nowrap'>
                                        <span className='text-sm text-gray-500'>{(currentPage - 1) * parPage + i + 1}</span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
                                                <img className='w-full h-full object-cover' src={d.images[0]} alt={d.name} />
                                            </div>
                                            <div className='min-w-0'>
                                                <p className='text-sm font-medium text-gray-800 truncate max-w-[200px]'>{d.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3 whitespace-nowrap'>
                                        <span className='inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700'>
                                            {d.category}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 whitespace-nowrap'>
                                        <span className='text-sm text-gray-600'>{d.brand}</span>
                                    </td>
                                    <td className='px-4 py-3 whitespace-nowrap'>
                                        <span className='text-sm font-semibold text-gray-800'>${d.price}</span>
                                    </td>
                                    <td className='px-4 py-3 whitespace-nowrap'>
                                        {d.discount === 0 ? (
                                            <span className='text-sm text-gray-400'>-</span>
                                        ) : (
                                            <span className='inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700'>
                                                {d.discount}% OFF
                                            </span>
                                        )}
                                    </td>
                                    <td className='px-4 py-3 whitespace-nowrap'>
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${d.stock > 10
                                                ? 'bg-green-100 text-green-700'
                                                : d.stock > 0
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                            {d.stock > 0 ? `${d.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 whitespace-nowrap'>
                                        <div className='flex items-center gap-2'>
                                            <Link
                                                to={`/seller/dashboard/edit-product/${d._id}`}
                                                className='p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors'
                                                title='Edit'
                                            >
                                                <FaEdit className='text-sm' />
                                            </Link>
                                            <Link
                                                to={`/seller/dashboard/add-banner/${d._id}`}
                                                className='p-2 text-cyan-600 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors'
                                                title='Add Banner'
                                            >
                                                <FaImage className='text-sm' />
                                            </Link>
                                            <Link
                                                to={`/seller/dashboard/delete-product/${d._id}`}
                                                className='p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors'
                                                title='Delete'
                                            >
                                                <FaTrash className='text-sm' />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {products.length === 0 && (
                        <div className='text-center py-12'>
                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <FaBox className='text-2xl text-gray-400' />
                            </div>
                            <p className='text-gray-500'>No products found</p>
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

export default Products;

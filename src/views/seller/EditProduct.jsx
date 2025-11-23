import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaBox, FaSave, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { get_product, update_product, messageClear, product_image_update } from '../../store/Reducers/productReducer';
import toast from 'react-hot-toast';

const EditProduct = () => {
    const { productId } = useParams()
    const dispatch = useDispatch()
    const { categorys } = useSelector(state => state.category)
    const { product, loader, successMessage, errorMessage } = useSelector(state => state.product)

    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }))
    }, [dispatch])

    useEffect(() => {
        dispatch(get_product(productId))
    }, [productId, dispatch])

    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
    })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const [cateShow, setCateShow] = useState(false)
    const [category, setCategory] = useState('')
    const [allCategory, setAllCategory] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const categorySearch = (e) => {
        const value = e.target.value
        setSearchValue(value)
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
            setAllCategory(srcValue)
        } else {
            setAllCategory(categorys)
        }
    }

    const [imageShow, setImageShow] = useState([])

    const changeImage = (img, files) => {
        if (files.length > 0) {
            dispatch(product_image_update({
                oldImage: img,
                newImage: files[0],
                productId
            }))
        }
    }

    useEffect(() => {
        if (product) {
            setState({
                name: product.name || '',
                description: product.description || '',
                discount: product.discount || '',
                price: product.price || '',
                brand: product.brand || '',
                stock: product.stock || ''
            })
            setCategory(product.category || '')
            setImageShow(product.images || [])
        }
    }, [product])

    useEffect(() => {
        if (categorys.length > 0) {
            setAllCategory(categorys)
        }
    }, [categorys])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage, dispatch])

    const update = (e) => {
        e.preventDefault()
        const obj = {
            name: state.name,
            description: state.description,
            discount: state.discount,
            price: state.price,
            brand: state.brand,
            stock: state.stock,
            category: category,
            productId: productId
        }
        dispatch(update_product(obj))
    }

    // Show loading while fetching product
    if (loader && !product) {
        return (
            <div className='px-4 lg:px-8 py-6'>
                <div className='flex items-center justify-center h-[400px]'>
                    <FaSpinner className='animate-spin text-4xl text-cyan-500' />
                </div>
            </div>
        )
    }

    return (
        <div className='px-4 lg:px-8 py-6'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-4'>
                    <Link to='/seller/dashboard/products' className='w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors'>
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>Edit Product</h1>
                        <p className='text-sm text-gray-500'>Update product information</p>
                    </div>
                </div>
                <Link to='/seller/dashboard/products' className='px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm'>
                    All Products
                </Link>
            </div>

            {/* Form */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='p-6'>
                    <form onSubmit={update} className='space-y-6'>
                        {/* Basic Info */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Product Name</label>
                                <input
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.name}
                                    type="text"
                                    name='name'
                                    placeholder='Enter product name'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Brand</label>
                                <input
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.brand}
                                    type="text"
                                    name='brand'
                                    placeholder='Enter brand name'
                                />
                            </div>
                        </div>

                        {/* Category & Stock */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='relative'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                                <div
                                    onClick={() => setCateShow(!cateShow)}
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer flex items-center justify-between'
                                >
                                    <span className={category ? 'text-gray-800' : 'text-gray-400'}>
                                        {category || 'Select category'}
                                    </span>
                                    <FaBox className='text-gray-400' />
                                </div>

                                {cateShow && (
                                    <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden'>
                                        <div className='p-3 border-b border-gray-100'>
                                            <input
                                                value={searchValue}
                                                onChange={categorySearch}
                                                className='w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm'
                                                type="text"
                                                placeholder='Search categories...'
                                            />
                                        </div>
                                        <div className='max-h-[200px] overflow-y-auto'>
                                            {allCategory.length > 0 && allCategory.map((c, i) => (
                                                <div
                                                    key={i}
                                                    className={`px-4 py-2.5 cursor-pointer hover:bg-cyan-50 transition-colors ${category === c.name ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setCateShow(false)
                                                        setCategory(c.name)
                                                        setSearchValue('')
                                                        setAllCategory(categorys)
                                                    }}
                                                >
                                                    {c.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Stock</label>
                                <input
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.stock}
                                    type="number"
                                    name='stock'
                                    placeholder='Available stock'
                                />
                            </div>
                        </div>

                        {/* Price & Discount */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Price ($)</label>
                                <input
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.price}
                                    type="number"
                                    name='price'
                                    placeholder='Product price'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Discount (%)</label>
                                <input
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.discount}
                                    type="number"
                                    name='discount'
                                    placeholder='Discount percentage'
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                            <textarea
                                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all resize-none'
                                onChange={inputHandle}
                                value={state.description}
                                name='description'
                                placeholder='Product description'
                                rows="4"
                            />
                        </div>

                        {/* Product Images */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-3'>Product Images</label>
                            <p className='text-xs text-gray-500 mb-3'>Click on an image to replace it</p>
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                                {(imageShow && imageShow.length > 0) && imageShow.map((img, i) => (
                                    <div key={i} className='relative group'>
                                        <label htmlFor={`img-${i}`} className='cursor-pointer block'>
                                            <div className='aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-cyan-500 transition-colors'>
                                                <img src={img} alt={`Product ${i + 1}`} className='w-full h-full object-cover' />
                                            </div>
                                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center'>
                                                <FaEdit className='text-white text-xl' />
                                            </div>
                                        </label>
                                        <input
                                            onChange={(e) => changeImage(img, e.target.files)}
                                            type="file"
                                            id={`img-${i}`}
                                            className='hidden'
                                            accept='image/*'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='pt-4 border-t border-gray-100'>
                            <button
                                disabled={loader}
                                type='submit'
                                className='px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 disabled:opacity-50'
                            >
                                {loader ? (
                                    <>
                                        <FaSpinner className='animate-spin' />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;

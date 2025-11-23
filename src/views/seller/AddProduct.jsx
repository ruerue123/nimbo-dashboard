import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from "react-icons/io";
import { FaBox, FaPlus, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const dispatch = useDispatch()
    const { categorys } = useSelector(state => state.category)
    const { loader, successMessage, errorMessage } = useSelector(state => state.product)

    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }))
    }, [dispatch])

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

    const [images, setImages] = useState([])
    const [imageShow, setImageShow] = useState([])

    const imageHandle = (e) => {
        const files = e.target.files
        const length = files.length;
        if (length > 0) {
            setImages([...images, ...files])
            let imageUrl = []
            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) })
            }
            setImageShow([...imageShow, ...imageUrl])
        }
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            setState({
                name: "",
                description: '',
                discount: '',
                price: "",
                brand: "",
                stock: ""
            })
            setImageShow([])
            setImages([])
            setCategory('')
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage, dispatch])

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow
            let tempImages = images
            tempImages[index] = img
            tempUrl[index] = { url: URL.createObjectURL(img) }
            setImageShow([...tempUrl])
            setImages([...tempImages])
        }
    }

    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i)
        const filterImageUrl = imageShow.filter((img, index) => index !== i)
        setImages(filterImage)
        setImageShow(filterImageUrl)
    }

    const add = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', state.name)
        formData.append('description', state.description)
        formData.append('price', state.price)
        formData.append('stock', state.stock)
        formData.append('discount', state.discount)
        formData.append('brand', state.brand)
        formData.append('category', category)

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i])
        }
        dispatch(add_product(formData))
    }

    useEffect(() => {
        setAllCategory(categorys)
    }, [categorys])

    return (
        <div className='px-4 md:px-6 py-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center'>
                        <FaPlus className='text-cyan-600 text-xl' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>Add Product</h1>
                        <p className='text-gray-500 text-sm'>Create a new product listing</p>
                    </div>
                </div>
                <Link
                    to='/seller/dashboard/products'
                    className='inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium'
                >
                    <FaBox className='text-sm' />
                    All Products
                </Link>
            </div>

            {/* Form Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                <form onSubmit={add}>
                    <div className='p-6 space-y-6'>
                        {/* Product Name & Brand */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Product Name</label>
                                <input
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
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
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.brand}
                                    type="text"
                                    name='brand'
                                    placeholder='Enter brand name'
                                />
                            </div>
                        </div>

                        {/* Category & Stock */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='relative'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                                <div
                                    onClick={() => setCateShow(!cateShow)}
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white hover:border-gray-300 transition-colors'
                                >
                                    <span className={category ? 'text-gray-800' : 'text-gray-400'}>
                                        {category || 'Select category'}
                                    </span>
                                    <FaChevronDown className={`text-gray-400 transition-transform ${cateShow ? 'rotate-180' : ''}`} />
                                </div>

                                {cateShow && (
                                    <div className='absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden'>
                                        <div className='p-3 border-b border-gray-100'>
                                            <input
                                                value={searchValue}
                                                onChange={categorySearch}
                                                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                type="text"
                                                placeholder='Search categories...'
                                            />
                                        </div>
                                        <div className='max-h-[200px] overflow-y-auto'>
                                            {allCategory.map((c, i) => (
                                                <div
                                                    key={i}
                                                    className={`px-4 py-3 cursor-pointer hover:bg-cyan-50 transition-colors ${category === c.name ? 'bg-cyan-50 text-cyan-600 font-medium' : 'text-gray-700'}`}
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
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Stock Quantity</label>
                                <input
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.stock}
                                    type="number"
                                    name='stock'
                                    placeholder='Enter stock quantity'
                                />
                            </div>
                        </div>

                        {/* Price & Discount */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Price ($)</label>
                                <input
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.price}
                                    type="number"
                                    name='price'
                                    placeholder='0.00'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Discount (%)</label>
                                <input
                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                    onChange={inputHandle}
                                    value={state.discount}
                                    type="number"
                                    name='discount'
                                    placeholder='0'
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                            <textarea
                                className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none'
                                onChange={inputHandle}
                                value={state.description}
                                name='description'
                                placeholder='Describe your product...'
                                rows="4"
                            ></textarea>
                        </div>

                        {/* Images */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Product Images</label>
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                                {imageShow.map((img, i) => (
                                    <div key={i} className='relative group'>
                                        <label htmlFor={i} className='block cursor-pointer'>
                                            <img
                                                className='w-full h-32 object-cover rounded-xl border border-gray-200'
                                                src={img.url}
                                                alt=""
                                            />
                                        </label>
                                        <input
                                            onChange={(e) => changeImage(e.target.files[0], i)}
                                            type="file"
                                            id={i}
                                            className='hidden'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => removeImage(i)}
                                            className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
                                        >
                                            <IoMdCloseCircle />
                                        </button>
                                    </div>
                                ))}

                                <label
                                    htmlFor="image"
                                    className='h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-all'
                                >
                                    <IoMdImages className='text-3xl text-gray-400 mb-1' />
                                    <span className='text-sm text-gray-500'>Add Image</span>
                                </label>
                                <input
                                    className='hidden'
                                    onChange={imageHandle}
                                    multiple
                                    type="file"
                                    id='image'
                                    accept='image/*'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='px-6 py-4 bg-gray-50 border-t border-gray-100'>
                        <button
                            disabled={loader}
                            className='w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                            {loader ? (
                                <PropagateLoader color='#fff' size={10} />
                            ) : (
                                <>
                                    <FaPlus />
                                    Add Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;

import React, { useEffect, useState } from 'react';
import Pagination from '../Pagination';
import { FaEdit, FaTrash, FaImage, FaSearch, FaTags, FaPlus, FaTimes } from 'react-icons/fa';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { categoryAdd, messageClear, get_category, updateCategory, deleteCategory } from '../../store/Reducers/categoryReducer';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Category = () => {
    const dispatch = useDispatch()
    const { loader, successMessage, errorMessage, categorys } = useSelector(state => state.category)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(10)
    const [show, setShow] = useState(false)
    const [imageShow, setImage] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState(null)
    const [state, setState] = useState({ name: '', image: '' })

    const imageHandle = (e) => {
        let files = e.target.files
        if (files.length > 0) {
            setImage(URL.createObjectURL(files[0]))
            setState({ ...state, image: files[0] })
        }
    }

    const addOrUpdateCategory = (e) => {
        e.preventDefault()
        if (isEdit) {
            dispatch(updateCategory({ id: editId, ...state }))
        } else {
            dispatch(categoryAdd(state))
        }
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            setState({ name: '', image: '' })
            setImage('')
            setIsEdit(false)
            setEditId(null)
            setShow(false)
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage, dispatch])

    useEffect(() => {
        dispatch(get_category({
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }))
    }, [searchValue, currentPage, parPage, dispatch])

    const handleEdit = (category) => {
        setState({ name: category.name, image: category.image })
        setImage(category.image)
        setEditId(category._id)
        setIsEdit(true)
        setShow(true)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteCategory(id))
        }
    }

    const resetForm = () => {
        setState({ name: '', image: '' })
        setImage('')
        setIsEdit(false)
        setEditId(null)
        setShow(false)
    }

    return (
        <div className='px-4 lg:px-6 py-5'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center'>
                            <FaTags className='text-white' />
                        </div>
                        <div>
                            <h1 className='text-lg font-bold text-gray-800'>Categories</h1>
                            <p className='text-xs text-gray-500'>{categorys.length} categories</p>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 w-full sm:w-auto'>
                        <div className='relative flex-1 sm:flex-none'>
                            <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                            <input
                                onChange={e => setSearchValue(e.target.value)}
                                value={searchValue}
                                className='w-full sm:w-[200px] pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:border-cyan-500 outline-none'
                                type="text"
                                placeholder='Search categories...'
                            />
                        </div>
                        <button
                            onClick={() => { resetForm(); setShow(true); }}
                            className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all'
                        >
                            <FaPlus /> Add Category
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                {/* Desktop Table Header */}
                <div className='hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase'>
                    <div className='col-span-1'>#</div>
                    <div className='col-span-2'>Image</div>
                    <div className='col-span-6'>Name</div>
                    <div className='col-span-3'>Actions</div>
                </div>

                <div className='divide-y divide-gray-100'>
                    {categorys.length === 0 ? (
                        <div className='p-8 text-center'>
                            <FaTags className='text-4xl text-gray-300 mx-auto mb-3' />
                            <p className='text-gray-500'>No categories found</p>
                        </div>
                    ) : (
                        categorys.map((cat, i) => (
                            <div key={i} className='p-4 hover:bg-gray-50 transition-colors'>
                                {/* Mobile View */}
                                <div className='lg:hidden space-y-3'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0'>
                                            <img src={cat.image} alt={cat.name} className='w-full h-full object-cover' />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-medium text-gray-800'>{cat.name}</h3>
                                            <p className='text-xs text-gray-500'>Category #{i + 1}</p>
                                        </div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className='flex-1 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1'
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            className='flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1'
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Desktop View */}
                                <div className='hidden lg:grid grid-cols-12 gap-4 items-center'>
                                    <div className='col-span-1 text-sm text-gray-600 font-medium'>
                                        {i + 1}
                                    </div>
                                    <div className='col-span-2'>
                                        <div className='w-12 h-12 bg-gray-100 rounded-xl overflow-hidden'>
                                            <img src={cat.image} alt={cat.name} className='w-full h-full object-cover' />
                                        </div>
                                    </div>
                                    <div className='col-span-6 font-medium text-gray-800'>
                                        {cat.name}
                                    </div>
                                    <div className='col-span-3 flex gap-2'>
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors'
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors'
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {categorys.length > 0 && (
                    <div className='p-4 border-t border-gray-100 flex justify-end'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={categorys.length}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                )}
            </div>

            {/* Add/Edit Modal Overlay */}
            {show && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl w-full max-w-md shadow-xl'>
                        <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                            <h2 className='font-bold text-gray-800'>{isEdit ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={resetForm} className='w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-lg'>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={addOrUpdateCategory} className='p-4'>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Category Name</label>
                                <input
                                    value={state.name}
                                    onChange={(e) => setState({ ...state, name: e.target.value })}
                                    className='w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-purple-500 outline-none text-sm'
                                    type="text"
                                    placeholder='Enter category name'
                                    required
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Category Image</label>
                                <label className='flex flex-col items-center justify-center h-48 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-500 transition-colors overflow-hidden' htmlFor="image">
                                    {imageShow ? (
                                        <img className='w-full h-full object-cover' src={imageShow} alt="Preview" />
                                    ) : (
                                        <>
                                            <FaImage className='text-3xl text-gray-300 mb-2' />
                                            <span className='text-sm text-gray-500'>Click to upload image</span>
                                        </>
                                    )}
                                </label>
                                <input onChange={imageHandle} className='hidden' type="file" name="image" id="image" accept="image/*" />
                            </div>

                            <div className='flex gap-3'>
                                <button
                                    type='button'
                                    onClick={resetForm}
                                    className='flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={loader}
                                    className='flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50'
                                >
                                    {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : isEdit ? 'Update' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;

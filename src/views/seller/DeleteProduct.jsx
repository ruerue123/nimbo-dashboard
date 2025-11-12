import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_product, delete_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const DeleteProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loader, successMessage, errorMessage } = useSelector(state => state.product);

  // Fetch product details before confirming delete
  useEffect(() => {
    dispatch(get_product(productId));
  }, [productId, dispatch]);

  // Handle delete
  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(delete_product(productId));
    }
  };

  // Handle success/error toasts
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate('/seller/dashboard/products'); // redirect after delete
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-[#d0d2d6] text-xl font-semibold'>Delete Product</h1>
          <Link
            to='/seller/dashboard/products'
            className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2'
          >
            All Products
          </Link>
        </div>

        <div className='text-[#d0d2d6]'>
          <h2 className='text-2xl font-semibold mb-3'>{product?.name}</h2>
          <p className='mb-5'>Are you sure you want to permanently delete this product?</p>

          <button
            disabled={loader}
            onClick={handleDelete}
            className='bg-red-600 hover:shadow-red-400/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'
          >
            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;

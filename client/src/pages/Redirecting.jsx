import axios from 'axios';
import { API_URL } from './../../config';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const Redirecting = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLongurl = async () => {
      try {
        const result = await axios.get(`${API_URL}/get-long-url/${id}`);
        if (result.data?.original_url) {
          window.location.href = result.data.original_url;
        } else {
          toast.error('Failed to fetch the long URL. Please try again later.');
        }
      } catch (error) {
        console.log(error);
        toast.error('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLongurl();
  }, [id]);

  return (
    <div>
      {loading ? (
        <>
          <BarLoader width={"100%"} color='36d7b7' />
          <br />
          <span className='font-bold text-2xl'>Redirecting.....</span>
        </>
      ) : null}
    </div>
  );
};

export default Redirecting;

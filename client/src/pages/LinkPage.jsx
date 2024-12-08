import React, { useContext, useState, useEffect } from 'react';
import { API_URL } from './../../config';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from './../App';
import Location from './../components/Location';
import Devices from './../components/Devices';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './../components/ui/card';
import { Button } from './../components/ui/button';
import { Copy, Download, LinkIcon, Trash } from 'lucide-react';

const LinkPage = () => {
  const { userAuth } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [url, setUrlData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLongurl();
  }, [userAuth]);

  const fetchLongurl = async () => {
    try {
      const result = await axios.get(`${API_URL}/get-url/${id}`, {
        headers: {
          'Authorization': `Bearer ${userAuth.access_token}`,
        },
      });
      setUrlData(result.data?.data[0]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch URL data.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = `${url?.title || 'QR_Code'}.png`;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const deleteURL = async () => {
    try {
      const response = await axios.delete(`${API_URL}/delete-url/${url._id}`, {
        headers: {
          'Authorization': `Bearer ${userAuth.access_token}`,
        },
      });
      if (response.status === 200) {
        toast.success("URL Deleted Successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error while deleting URL:", error);
      toast.error("Failed to delete URL.");
    }
  };

  const link = url ? (url?.custom_url || url.short_url) : '';
  if (!userAuth.access_token) {
    navigate('/');
    return null;
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <BeatLoader size={"100%"} color='36d7b7' />
        </div>
      ) : (
        <div className="container mx-auto p-6">
          {url && (
            <div className="flex flex-col gap-10 sm:flex-row justify-between">
              <div className="flex flex-col gap-7 items-start rounded-lg sm:w-2/5">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-300 capitalize hover:underline cursor-pointer">{url.title}</h3>
                <a href={`${API_URL}/${link}`} target='_blank' className="text-lg sm:text-xl text-blue-600 font-bold hover:underline cursor-pointer">
                  {API_URL}/{link}
                </a>
                <a href={url.original_url} target='_blank' className="flex items-end text-md text-gray-600">
                  <LinkIcon className="mr-2" />
                  {url?.original_url}
                </a>
                <span className="text-xl text-gray-500"><span className='font-bold text-slate-100'>Created On : </span>{new Date(url?.createdAt).toLocaleString()}</span>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="ghost"
                    className="text-blue-500 hover:bg-blue-500 text-lg py-3 px-6"
                    onClick={() => {
                      navigator.clipboard.writeText(`${API_URL}/`+url.short_url);
                      toast.success("Copied to Clipboard!");
                    }}
                  >
                    <Copy style={{ width: '22px', height: '22px' }} />

                  </Button>
                  <Button
                    variant="ghost"
                    className="text-blue-500 hover:bg-blue-500 text-lg py-3 px-6"
                    onClick={downloadImage}
                  >
                    <Download style={{ width: '22px', height: '22px' }}/>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={deleteURL}
                    className="text-red-800 hover:bg-red-500 text-lg py-3 px-6"
                  >
                    <Trash style={{ width: '22px', height: '22px' }} />
                  </Button>
                </div>

                <img src={url?.qr} alt="QR Code" className="mt-6 w-4/5  rounded-lg ring ring-blue-500 p-1 object-contain" />
              </div>

              <Card className="sm:w-3/5 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-4xl font-extrabold text-gray-300">Stats</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-xl font-bold'>{url.clicks.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Location Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Location stats={url?.clicks} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Device Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Devices stats={url?.clicks} />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkPage;

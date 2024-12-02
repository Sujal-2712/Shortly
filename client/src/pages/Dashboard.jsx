import React, { useContext, useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { Button } from './../components/ui/button';
import { Input } from './../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './../components/ui/card';
import { Filter, LucideSplitSquareHorizontal } from 'lucide-react';
import axios from 'axios'; // Importing axios
import LinkCard from "./../components/LinkCard"
import CreateLink from '@/components/CreateLink';
import { UserContext } from './../App';
import { API_URL } from './../../config';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });
  const [loading, setLoading] = useState(false);

  const { userAuth } = useContext(UserContext);
  const navigate = useNavigate();


  const fetchURLs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user-urls`, {
        headers: {
          Authorization: `Bearer ${userAuth.access_token}`
        },
      });
      const result = response.data;
      setLinks(result.data);
      const totalLinks = result.data.length;
      const totalClicks = result.data.reduce((acc, url) => acc + url.clicks.length, 0);

      setStats({
        totalLinks,
        totalClicks,
      });
    } catch (err) {
      console.error("Error fetching URLs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchURLs();
  }, []);

  // Filter links based on search query
  const filteredLinks = links.filter((link) =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='flex flex-col gap-8 px-5'>
      {/* Loader */}
      {loading && <BarLoader width={"100%"}  color='#36d7b7' />}

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Total Links Created</CardTitle>
            <CardDescription className="text-xl font-bold">{stats.totalLinks}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription className="text-xl font-bold">{stats.totalClicks}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Links Section */}
      <div className='flex justify-between'>
        <h1 className='text-4xl font-extrabold'>My Links</h1>
        <CreateLink links={links} setLinks={setLinks} />
      </div>

      {/* Filter Input */}
      <div className='relative'>
        <Input
          type="text"
          placeholder="Filter Links.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className='absolute top-2 right-2 p-1' />
      </div>

      {/* Display filtered links */}
      {filteredLinks.map((url, index) => (
        <LinkCard key={index} url={url} fetchUrls={fetchURLs} />
      ))}
    </div>
  );
};

export default Dashboard;

import React, { useContext, useState } from 'react';
import { Button } from './../components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { UserContext } from './../App';
import { useNavigate } from 'react-router-dom';
import logo from "./../assets/logo.png"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./../components/ui/accordion";

const LandingPage = () => {
  const [longurl, setLongurl] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userAuth } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longurl) {
      toast.error("Please provide a URL to shorten!");
      return;
    }
    if (!userAuth.access_token) {
      toast.error("Please Login First!!");
      navigate("/auth");
      return;
    }

    navigate(`/dashboard?newlink=${longurl}`);
  };

  return (
    <div className="flex flex-col items-center px-5 bg-gradient-to-r  min-h-screen">
      {/* Hero Section */}
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-6xl text-white text-center font-extrabold shadow-md">
        The Only URL Shortener <br /> you&rsquo;ll ever need!!
      </h2>

      <p className="text-xl md:text-2xl font-bold text-white text-center mb-8 max-w-3xl">
        Use our URL shortener, QR Codes, and landing pages to engage your audience and connect them to the right information. Build, edit, and track everything inside Connections Platform.
      </p>

      <form onSubmit={handleSubmit} className="sm:h-14 flex flex-col my-5 px-8 sm:flex-row w-full md:w-2/4 gap-5">
        <Input
          type="url"
          value={longurl}
          onChange={(e) => setLongurl(e.target.value)}
          placeholder="Paste a long URL"
          className="h-full flex-1 py-4 px-4"
        />
        <Button className="h-full font-bold" type="submit" variant="destructive" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </Button>
      </form>
      {/* Image Section */}
      <img
        src={logo}
        alt="Visual representation of URL shortening"
        className="w-[70%] my-11 rounded-xl ring-8 shadow-lg"
      />

      {/* FAQ Section */}
      <p className="font-bold text-4xl sm:text-5xl lg:text-4xl text-center text-white  my-4 shadow-md">
        Frequently Asked Questions (FAQs)
      </p>

      <Accordion type="multiple" className="w-full sm:w-[85%] md:px-11 mt-10 mb-16" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-semibold text-gray-400">What is a URL shortener?</AccordionTrigger>
          <AccordionContent className="text-lg text-gray-300">
            A URL shortener is a tool that takes a long URL and converts it into a short, manageable link, making it easier to share and track.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-semibold text-gray-400">Is the shortened URL permanent?</AccordionTrigger>
          <AccordionContent className="text-lg text-gray-300">
            Yes, your shortened URLs are stored permanently unless you delete them from your account.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-semibold text-gray-400">Can I track link clicks?</AccordionTrigger>
          <AccordionContent className="text-lg text-gray-300">
            Absolutely! Our URL shortener provides analytics for every link, including the total number of clicks, geographic data, and device type.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-xl font-semibold text-gray-400">Is the service free?</AccordionTrigger>
          <AccordionContent className="text-lg text-gray-300">
            Yes, our basic URL shortening service is free. Advanced features like analytics and custom domains may require a subscription.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="text-xl font-semibold text-gray-400">Can I customize my shortened URL?</AccordionTrigger>
          <AccordionContent className="text-lg text-gray-300">
            Yes, you can customize the shortened URL to match your brand or make it more memorable. This feature may require an upgraded plan.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger className="text-xl font-semibold text-gray-400">Can I delete a shortened URL?</AccordionTrigger>
          <AccordionContent className="text-lg text-gray-300">
            Yes, you can delete any shortened URL from your account dashboard at any time.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
};

export default LandingPage;

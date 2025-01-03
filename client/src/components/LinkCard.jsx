import { Copy, Trash, Download } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios"; // Import axios
import { UserContext } from "../App"; 
import { API_URL } from "../../config"; 

const LinkCard = ({ url, fetchUrls }) => {
  const { userAuth } = useContext(UserContext);

  const DownloadImage = () => {

    const imageUrl = url?.qr;
    const fileName = `${url?.title || "QR_Code"}.png`;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

  };
  const deleteURL = async () => {
    try {
      console.log(url);
      const response = await axios.delete(`${API_URL}/delete-url/${url._id}`, {
        headers: {
          Authorization: `Bearer ${userAuth.access_token}`,
        },
      });

      if (response.status === 200) {
        toast.success("URL Deleted Successfully!!");
        fetchUrls();
      } else {
        console.error("Failed to delete URL, response:", response);
      }
    } catch (error) {
      console.error("Error while deleting URL:", error);
      toast.error("Failed to delete URL.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-slate-800 rounded-lg">
      {/* QR Code Image */}
      <img
        src={url.qr}
        alt="qr code"
        className="w-36 h-36 object-contain ring ring-blue-500 self-start"
      />

      {/* URL Details */}
      <Link to={`/link/${url._id}`} className="flex flex-col flex-1">
        <span className="text-2xl font-bold hover:underline cursor-pointer">
          {url.title}
        </span>
        <span className="text-xl text-blue-400 font-bold hover:underline cursor-pointer">
          {url.short_url}
        </span>
        <span className="flex text-xl items-center gap-1 hover:underline cursor-pointer">
          {url.original_url}
        </span>
        <span className="flex items-end font-medium text-sm flex-1">
          Created On : {new Date(url?.createdAt).toLocaleString()}
        </span>
      </Link>

      {/* Action Buttons */}
      <div className="flex gap-1">
        {/* Copy Short URL */}
        <Button
          variant="ghost"
          className="text-blue-500 hover:bg-blue-500"
          onClick={() => {
            navigator.clipboard.writeText(`${API_URL}/`+url.short_url);
            toast.success("Copied to Clipboard!!");
          }}
        >
          <Copy style={{ width: '20px', height: '20px' }} />
        </Button>

        {/* Download QR Code */}
        <Button
          variant="ghost"
          className="text-blue-500 hover:bg-blue-500"
          onClick={DownloadImage}
        >
          <Download style={{ width: '20px', height: '20px' }}/>
        </Button>

        {/* Delete URL */}
        <Button
          variant="ghost"
          onClick={deleteURL}
          className="text-red-800 hover:bg-red-500"
        >
          <Trash style={{ width: '20px', height: '20px' }}/>
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;

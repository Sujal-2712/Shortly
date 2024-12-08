import React, { useContext, useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./../components/ui/dialog";
import { Button } from './ui/button';
import axios from 'axios';
import { QRCode } from 'react-qrcode-logo';
import * as yup from "yup";
import { Input } from './ui/input';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from './../../config';
import { UserContext } from './../App';
import toast from 'react-hot-toast';
import Error from './Error';

const CreateLink = ({ links, setLinks }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const longUrl = searchParams.get("newlink");
    const { userAuth } = useContext(UserContext);
    const ref = useRef();
    const [IsOpen, setIsOpen] = useState(false);

    const [formValues, setFormValues] = useState({
        title: "",
        longUrl: longUrl ? longUrl : "",
        customUrl: "",
    });

    const [errors, setErrors] = useState({});

    // Yup schema for validation
    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        longUrl: yup.string().url("Provide a valid URL").required("URL is required"),
        customUrl: yup.string(),
    });

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        });
    };

    const creatNewLink = async (e) => {
        e.preventDefault();

        try {
            setErrors({});
            await schema.validate(formValues, { abortEarly: false });

            const canvas = ref.current.canvasRef.current;
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve);
            });

            const formData = new FormData();
            formData.append("title", formValues.title);
            formData.append("longUrl", formValues.longUrl);
            formData.append("customUrl", formValues.customUrl);
            formData.append("qrCodeImage", blob, "qrCode.png");

            const response = await axios.post(`${API_URL}/shorten`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userAuth.access_token}`,
                },
            });
            if (response.status === 201) {
                setLinks((prevLinks) => [...prevLinks, response.data?.data])
                toast.success("URL shortened successfully!");
                setFormValues({ title: "", longUrl: "", customUrl: "" });
                setIsOpen(false);
            }
        } catch (error) {
            if (error.name === "ValidationError") {
                const fieldErrors = error.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setErrors(fieldErrors);
            } else {
                toast.error(error.response?.data?.message || "An error occurred.");
                console.error("Error creating link:", error);
            }
        }
    };

    return (
        <div>
            <Dialog
                defaultOpen={longUrl}
                onOpenChange={(res) => {
                    if (!res) {
                        setSearchParams({});
                        setFormValues({ ...formValues, longUrl: "" });
                    }
                }}
            >
                <DialogTrigger><Button>Create New Link</Button></DialogTrigger>
                <DialogContent className="sm:max-w-md mx-5">
                    <DialogHeader>
                        <DialogTitle className="my-1 text-2xl">Create New Link</DialogTitle>
                    </DialogHeader>

                    {formValues?.longUrl && (
                        <QRCode value={formValues?.longUrl}  size={200} ref={ref} />
                    )}

                    <form onSubmit={creatNewLink} className="flex flex-col gap-4">

                        <div className=''>
                            <Input
                                onChange={handleChange}
                                value={formValues.title}
                                id="title"
                                placeholder="Enter link title"
                            />
                            {errors.title && <Error msg={errors.title} />}
                        </div>

                        <div>
                            <Input
                                onChange={handleChange}
                                value={formValues.longUrl}
                                id="longUrl"
                                placeholder="Enter Long URL"
                            />
                            {errors.longUrl && <Error msg={errors.longUrl} />}
                        </div>


                        <div className="flex items-center gap-2">
                            <Input
                                onChange={handleChange}
                                value={formValues.customUrl}
                                id="customUrl"
                                placeholder="Custom Link (Optional)"
                            />
                            {errors.customUrl && <Error msg={errors.customUrl} />}
                        </div>


                        <DialogFooter className="sm:justify-start">
                            <Button type="submit">Create Link</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateLink;

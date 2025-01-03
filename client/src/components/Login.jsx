import React, { useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import Error from './Error';
import { Button } from './ui/button';
import { useFormik } from 'formik';
import { API_URL } from "./../../config";
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { UserContext } from "../App";
import { storeInSession } from '@/common/session';
import { LogIn, LogInIcon } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { setUserAuth } = useContext(UserContext);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${API_URL}/login`, values); // Using axios to make the POST request
                if (response && response.data) {
                    storeInSession("user", JSON.stringify(response.data));
                    setUserAuth({ access_token: response.data.token, profile_img: response.data.profile_img, email: response.data.email });
                    formik.resetForm();
                    toast.success('Login Successful');
                    navigate('/');
                } else {
                    toast.error('Login failed. Please check your credentials.');
                }
            } catch (err) {
                toast.error(err.response?.data?.error || "Error occured!!");
                console.error('Login failed:', err);
            }
        },
    });

    return (
        <div className="flex justify-center mt-5 items-center">
            <Card className="w-full shadow-lg  p-4 rounded-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                        <LogInIcon style={{height:'30px',width:'30px'}}/>
                        Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="my-2">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                                className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <Error msg={formik.errors.email} />
                            )}
                        </div>

                        <div className="my-2">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                                className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <Error msg={formik.errors.password} />
                            )}
                        </div>

                        <Button
                            variant="destructive"
                            disabled={formik.isSubmitting || !formik.isValid}
                            type="submit"
                            className="w-full mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            {formik.isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>

                        <p className="text-sm mt-2 text-gray-600">
                            <a href="/forgot-password" className="text-blue-500 hover:underline">
                                Forgot password?
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;

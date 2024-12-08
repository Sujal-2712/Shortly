import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_URL } from './../../config';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Input } from './ui/input';
import Error from './Error';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import { CreativeCommons, CreditCardIcon } from 'lucide-react';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const Signup = ({ setIsCreated }) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const { email, password } = values;
                const response = await axios.post(`${API_URL}/signup`, { email, password });
                if (response && response.data) {
                    toast.success("Account created successfully!");
                    setIsCreated(true);
                    formik.resetForm();
                }
            } catch (err) {
                console.error('Error during signup:', err);
                toast.error('Failed to create account. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="flex justify-center mt-5 items-center">
            <Card className="w-full shadow-lg p-4 rounded-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        Sign Up</CardTitle>
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

                        <div className="my-2">
                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                                className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <Error msg={formik.errors.confirmPassword} />
                            )}
                        </div>

                        <Button
                            variant="destructive"
                            disabled={loading || formik.isSubmitting}
                            type="submit"
                            className="w-full bg-blue-600 text-white mt-3 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            {loading ? 'Signing up... Please wait...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;

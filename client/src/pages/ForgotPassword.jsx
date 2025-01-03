import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './../components/ui/card';
import { Input } from './../components/ui/input';
import Error from './../components/Error';
import { Button } from './../components/ui/button';
import { useFormik } from 'formik';
import { API_URL } from "./../../config";
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpExpired, setOtpExpired] = useState(false);
    const [timer, setTimer] = useState(600); // OTP expires in 5 minutes
    const [passwordReset, setPasswordReset] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        if (otpSent && timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        }
        if (timer === 0) {
            setOtpExpired(true);
        }
    }, [otpSent, timer]);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });

    const formikEmail = useFormik({
        initialValues: { email: '' },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${API_URL}/forgot-password`, { email: values.email });
                if (response && response.data) {
                    setOtp(response.data.otp);
                    setUserEmail(values.email);
                    setOtpSent(true);
                    toast.success('OTP sent to your email address');
                    formikEmail.resetForm();
                }
            } catch (err) {
                toast.error(err.response?.data?.error || "Error occurred while sending OTP!");
                console.error('Forgot Password request failed:', err);
            }
        },
    });

    const validationOtpSchema = Yup.object({
        otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
    });

    const formikOtp = useFormik({
        initialValues: { otp: '' },
        validationSchema: validationOtpSchema,
        onSubmit: async (values) => {
            try {
                if (otp == values.otp) {
                    setPasswordReset(true);
                    toast.success('OTP verified! You can now reset your password.');
                    formikOtp.resetForm();
                } else {
                    toast.error('Invalid OTP!');
                }

            } catch (err) {
                toast.error('Error occurred while verifying OTP!');
                console.error('OTP verification failed:', err);
            }
        },
    });

    const validationPasswordSchema = Yup.object({
        newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const navigate = useNavigate();

    const formikPassword = useFormik({
        initialValues: { newPassword: '', confirmPassword: '' },
        validationSchema: validationPasswordSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${API_URL}/reset-password`, { email: userEmail, password: values.newPassword });
                if (response && response.data.success) {
                    toast.success('Password reset successfully');
                    setOtpSent(false);
                    setPasswordReset(false);
                    formikPassword.resetForm();
                    navigate("/auth");
                }
            } catch (err) {
                toast.error('Error occurred while resetting password!');
                console.error('Password reset failed:', err);
            }
        },
    });

    return (
        <div className="flex justify-center mt-24 items-center">
            <Card className="shadow-lg p-4 rounded-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{otpSent ? (passwordReset ? 'Reset Password' : 'Enter OTP') : 'Forgot Password'}</CardTitle>
                    <CardDescription className="text-sm">
                        {otpSent
                            ? otpExpired
                                ? 'OTP has expired. Please request a new one.'
                                : 'Enter the OTP sent to your email address.'
                            : 'Enter your email to receive an OTP to reset your password'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {!otpSent && !passwordReset && (
                        <form onSubmit={formikEmail.handleSubmit}>
                            <div className="my-2">
                                <Input
                                    label="Email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formikEmail.values.email}
                                    onChange={formikEmail.handleChange}
                                    onBlur={formikEmail.handleBlur}
                                    required
                                    className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formikEmail.touched.email && formikEmail.errors.email && (
                                    <Error msg={formikEmail.errors.email} />
                                )}
                            </div>

                            <Button
                                variant="destructive"
                                disabled={formikEmail.isSubmitting || !formikEmail.isValid}
                                type="submit"
                                className="w-full mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                {formikEmail.isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                        </form>
                    )}

                    {otpSent && !passwordReset && !otpExpired && (
                        <form onSubmit={formikOtp.handleSubmit}>
                            <div className="my-2">
                                <Input
                                    label="OTP"
                                    type="text"
                                    name="otp"
                                    placeholder="Enter the OTP"
                                    value={formikOtp.values.otp}
                                    onChange={formikOtp.handleChange}
                                    onBlur={formikOtp.handleBlur}
                                    required
                                    className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formikOtp.touched.otp && formikOtp.errors.otp && (
                                    <Error msg={formikOtp.errors.otp} />
                                )}
                            </div>

                            <Button
                                variant="destructive"
                                disabled={formikOtp.isSubmitting || !formikOtp.isValid}
                                type="submit"
                                className="w-full mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                {formikOtp.isSubmitting ? 'Verifying OTP...' : 'Verify OTP'}
                            </Button>

                            <p className="text-sm mt-2 text-gray-600">
                                {timer > 0 ? `OTP expires in ${Math.floor(timer / 60)}:${timer % 60}` : 'OTP expired'}
                            </p>
                        </form>
                    )}

                    {passwordReset && (
                        <form onSubmit={formikPassword.handleSubmit}>
                            <div className="my-2">
                                <Input
                                    label="New Password"
                                    type="password"
                                    name="newPassword"
                                    placeholder="Enter your new password"
                                    value={formikPassword.values.newPassword}
                                    onChange={formikPassword.handleChange}
                                    onBlur={formikPassword.handleBlur}
                                    required
                                    className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formikPassword.touched.newPassword && formikPassword.errors.newPassword && (
                                    <Error msg={formikPassword.errors.newPassword} />
                                )}
                            </div>

                            <div className="my-2">
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm your new password"
                                    value={formikPassword.values.confirmPassword}
                                    onChange={formikPassword.handleChange}
                                    onBlur={formikPassword.handleBlur}
                                    required
                                    className="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword && (
                                    <Error msg={formikPassword.errors.confirmPassword} />
                                )}
                            </div>

                            <Button
                                variant="destructive"
                                disabled={formikPassword.isSubmitting || !formikPassword.isValid}
                                type="submit"
                                className="w-full mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                {formikPassword.isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;

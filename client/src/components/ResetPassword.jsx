import React, { useState, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './../components/ui/card';
import { Input } from './../components/ui/input';
import Error from './../components/Error';
import { Button } from './../components/ui/button';
import { useFormik } from 'formik';
import { API_URL } from "./../../config";
// import { useContext } from 'react';
import { UserContext } from "./../App";
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
    const { userAuth } = useContext(UserContext);
    const validationPasswordSchema = Yup.object({
        newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });
    if (userAuth.access_token == null) {
        navigate("/auth");
        return;
    }
    const navigate = useNavigate();
    const formikPassword = useFormik({
        initialValues: { newPassword: '', confirmPassword: '' },
        validationSchema: validationPasswordSchema,
        onSubmit: async (values) => {
            try {
                console.log(values);
                console.log(userAuth);
                const response = await axios.post(`${API_URL}/reset-password`, { password: values.newPassword }, {
                    headers: {
                        'Authorization': `Bearer ${userAuth.access_token}`
                    }
                });
                if (response && response.data.success) {
                    console.log(response);
                    toast.success('Password reset successfully');
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
        <div className="flex justify-center mt-24  items-center">
            <Card className="shadow-lg p-4 md:w-[25%] w-[85%] rounded-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2 justify-center">
                        <Lock/>
                        Reset Your Password</CardTitle>
                </CardHeader>

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
            </Card>
        </div>
    );
};

export default ResetPassword;

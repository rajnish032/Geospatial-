"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import { Spin, Tooltip } from 'antd';
import { SiWhatsapp } from 'react-icons/si';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: "/", sameSite: 'lax' });

const GISDashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);

    // Set API base URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('Fetching user data...');
                console.log('Current cookies:', cookies.getAll());
                
                const accessToken = cookies.get('token');
                if (!accessToken) {
                    throw new Error('No access token found');
                }

                // Debug: Print the exact request URL
                const requestUrl = `${API_BASE_URL}/api/user/me`;
                console.log('Making request to:', requestUrl);

                const response = await axios.get(requestUrl, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                console.log('User data response:', response.data);

                if (!response.data.user) {
                    throw new Error('User data not found in response');
                }

                // Transform response to match expected format
                const userData = {
                    ...response.data.user,
                    gisRegistrationComplete: response.data.user?.gisRegistrationComplete || false,
                    gisStatus: response.data.user?.gisStatus || 'pending'
                };

                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data:", {
                    message: error.message,
                    response: error.response?.data,
                    config: error.config,
                    stack: error.stack
                });

                toast.error('Session expired or invalid. Please login again.');
                router.push('/account/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router, API_BASE_URL]);

    const handleLogout = async () => {
        try {
            setLogoutLoading(true);
            const response = await axios.post(`${API_BASE_URL}/api/user/logout`, {}, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                }
            });

            if (response.data.status === "success") {
                // Clear all relevant cookies
                cookies.remove('accessToken');
                cookies.remove('refreshToken');
                cookies.remove('is_auth');
                
                setUser(null);
                toast.success("Logged out successfully");
                router.push("/");
            }
        } catch (error) {
            console.error("Logout error:", {
                message: error.message,
                response: error.response?.data,
                config: error.config
            });
            toast.error(error.response?.data?.message || "Could not log out");
        } finally {
            setLogoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='relative'>
            {!user?.isGISRegistered ? (
                <div className='flex items-center justify-center w-full min-h-[80vh]'>
                    <div className='p-5 my-10 mx-2 relative min-w-[300px] max-w-[500px] min-h-[500px] rounded-3xl shadow-xl border-4 border-green-500 md:px-8'>
                        <h2 className='text-3xl text-center font-bold my-5'>Welcome, {user?.name}</h2>
                        <div className='text-lg mt-10 px-2'>
                            <p>Thank you for joining our <b>GIS Professionals Network</b>.</p>
                            <p className='text-green-600 font-semibold'>Complete your specialist profile to get started:</p>
                            <ul className='list-disc pl-5 my-4 space-y-2'>
                                <li>Showcase your GIS skills and expertise</li>
                                <li>Get matched with relevant projects</li>
                                <li>Start receiving opportunities</li>
                            </ul>
                        </div>
                        <div className='my-10 absolute bottom-0 md:bottom-3 w-[90%] mx-auto'>
                            <Link 
                                href="/gis/profile"
                                className='bg-green-500 rounded w-[90%] text-center max-w-[500px] block mx-auto hover:bg-green-600 px-2 py-3 text-lg text-white font-bold transition-colors'
                            >
                                Complete GIS Profile
                            </Link>
                        </div>
                    </div>
                </div>
            ) : user?.gisStatus === 'suspended' ? (
                <div className='flex items-center justify-center min-h-[80vh] p-5 text-center'>
                    <div className='max-w-md'>
                        <h2 className='text-3xl lg:text-4xl font-bold my-5 text-red-600'>Account Suspended ⚠️</h2>
                        <div className='space-y-4'>
                            <p>Your GIS specialist account has been temporarily suspended.</p>
                            <p>Please contact our support team for clarification.</p>
                            <div className='my-6'>
                                <button 
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    className='bg-red-500 rounded w-full text-center max-w-[400px] block mx-auto hover:bg-red-600 px-4 py-3 text-lg text-white font-bold disabled:bg-red-400 disabled:cursor-not-allowed'
                                >
                                    {logoutLoading ? 'Logging out...' : 'Log out'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : user?.gisStatus === 'pending' ? (
                <div className='flex items-center justify-center min-h-[80vh] p-5 text-center'>
                    <div className='max-w-md'>
                        <h2 className='text-3xl lg:text-4xl font-bold my-5'>Profile Under Review</h2>
                        <div className='space-y-4'>
                            <p>Thank you for completing your GIS specialist profile!</p>
                            <p>Our team is reviewing your information.</p>
                            <p className='text-green-600 mt-3'>Expected review time: 2-3 business days</p>
                            <div className='my-6'>
                                <button 
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    className='bg-green-500 rounded w-full text-center max-w-[400px] block mx-auto hover:bg-green-600 px-4 py-3 text-lg text-white font-bold disabled:bg-green-400 disabled:cursor-not-allowed'
                                >
                                    {logoutLoading ? 'Logging out...' : 'Log out'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex items-center justify-center min-h-[80vh] p-5 text-center'>
                    <div className='max-w-md'>
                        <h2 className='text-3xl lg:text-4xl font-bold my-5'>Welcome, GIS Specialist!</h2>
                        <div className='space-y-6'>
                            <p className='text-green-600 font-semibold'>Your profile is active and visible to clients.</p>
                            <div className='flex flex-col gap-4 my-6'>
                                <Link 
                                    href="/gis-projects" 
                                    className='bg-green-500 rounded w-full text-center hover:bg-green-600 px-4 py-3 text-lg text-white font-bold transition-colors'
                                >
                                    View Available Projects
                                </Link>
                                <Link 
                                    href="/gis-profile" 
                                    className='bg-blue-500 rounded w-full text-center hover:bg-blue-600 px-4 py-3 text-lg text-white font-bold transition-colors'
                                >
                                    Edit Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    className='bg-gray-500 rounded w-full hover:bg-gray-600 px-4 py-3 text-lg text-white font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
                                >
                                    {logoutLoading ? 'Logging out...' : 'Log out'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Tooltip
                color="black"
                defaultOpen
                title="👋 Need help? Contact our GIS support team"
                placement="left"
            >
                <SiWhatsapp
                    size={50}
                    onClick={() => window.open('https://wa.me/916006535445', '_blank')}
                    className="fixed text-green-500 cursor-pointer duration-500 hover:scale-125 md:bottom-16 lg:right-20 right-10 bottom-20"
                />
            </Tooltip>
        </div>
    );
};

export default GISDashboard;
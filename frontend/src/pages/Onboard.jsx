import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Mail, Lock, User } from 'lucide-react';

export default function Onboard() {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Panel - Branding/Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white flex-col justify-between p-12">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
                    <div className="absolute bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
                </div>

                {/* Top Logo Area */}
                <div className="relative z-10 flex items-center space-x-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <Hexagon className="w-6 h-6 text-indigo-800 fill-indigo-800" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Kinetic</span>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 max-w-lg mt-12 mb-auto">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                        <h2 className="text-3xl font-bold leading-tight mb-4">
                            "Kinetic transformed how our product team operates."
                        </h2>
                        <p className="text-indigo-100 mb-8 font-light leading-relaxed">
                            We went from guessing what our users wanted to knowing exactly what to build next. The insights are instant.
                        </p>

                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-400">
                                <img src="https://i.pravatar.cc/150?img=32" alt="Sarah Jenkins" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="font-bold">Sarah Jenkins</div>
                                <div className="text-indigo-200 text-sm">VP of Product, TechCorp</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Area */}
                <div className="relative z-10 flex justify-between text-sm text-indigo-300">
                    <span>&copy; {new Date().getFullYear()} Kinetic Inc.</span>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-white transition-colors duration-200 hidden sm:block">Terms</a>
                        <a href="#" className="hover:text-white transition-colors duration-200 hidden sm:block">Privacy</a>
                    </div>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-gray-50/50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo (hidden on desktop) */}
                    <div className="flex lg:hidden items-center space-x-2 mb-8 justify-center">
                        <div className="w-10 h-10 bg-indigo-800 rounded-xl flex items-center justify-center shadow-md">
                            <Hexagon className="w-6 h-6 text-white fill-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">Kinetic</span>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create an account</h2>
                            <p className="text-gray-500 text-sm">Start your 14-day free trial. No credit card required.</p>
                        </div>

                        {/* SSO Buttons */}
                        <div className="space-y-3 mb-6">
                            <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Sign up with Google</span>
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-400 text-xs font-semibold uppercase tracking-wider">Or register with email</span>
                            </div>
                        </div>

                        {/* Standard Form Component */}
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="firstName">First Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <input
                                            id="firstName"
                                            type="text"
                                            required
                                            className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm"
                                            placeholder="Jane"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="lastName">Last Name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        required
                                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">Work Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm"
                                        placeholder="Create a strong password"
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-gray-500">Must be at least 8 characters long</p>
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Create Account
                                </button>
                            </div>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                By signing up, you agree to our <a href="#" className="underline hover:text-gray-700">Terms of Service</a> and <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>.
                            </p>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, Mail, Lock, User, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail, user, profile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && !authLoading) {
            // Redirect user based on whether they've completed the profile builder
            if (profile !== null) {
                if (profile.profile_completed) {
                    navigate('/discover');
                } else {
                    // New user or incomplete profile → send to 7-page builder
                    navigate('/profile/build');
                }
            }
        }

        // Check for Supabase OAuth errors in the URL hash
        const hash = window.location.hash;
        if (hash && hash.includes('error=')) {
            const params = new URLSearchParams(hash.substring(1)); // Remove the '#'
            const errorDesc = params.get('error_description');
            if (errorDesc) {
                // Formatting common Supabase errors for the user
                if (errorDesc.toLowerCase().includes('database error saving new user') || errorDesc.toLowerCase().includes('already registered')) {
                    setErrorMsg("An account with this email already exists using a different sign-in method (e.g., Google). Please log in with that method.");
                } else {
                    setErrorMsg(errorDesc.replace(/\+/g, ' '));
                }
                
                // Clean the URL so the error doesn't persist on refresh
                window.history.replaceState(null, '', window.location.pathname);
            }
        }
    }, [user, navigate, profile, authLoading]);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        
        try {
            if (isSignUp) {
                if (!username || !email || !password || !fullName) {
                    throw new Error("All fields are required.");
                }
                const { error } = await signUpWithEmail(email, password, username, fullName);
                if (error) throw error;
                // Navigate directly to profile builder - no need for email confirmation
                navigate('/profile/build');
            } else {
                if (!email || !password) {
                    throw new Error("Email/Username and Password are required.");
                }
                const { error } = await signInWithEmail(email, password);
                if (error) throw error;
            }
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Panel - Branding/Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 text-white flex-col justify-between p-12">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-white opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
                </div>

                {/* Top Logo Area */}
                <div className="relative z-10 flex items-center space-x-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <Hexagon className="w-6 h-6 text-indigo-700 fill-indigo-700" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Kinetic</span>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 max-w-lg mt-20 mb-auto">
                    <h1 className="text-5xl font-extrabold leading-tight mb-6">
                        Build better products. <br />Faster.
                    </h1>
                    <p className="text-indigo-100 text-lg mb-8 leading-relaxed font-light">
                        Join thousands of teams who use Kinetic to understand their data, find answers, and make decisions with confidence.
                    </p>

                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-white overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User AVatar" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-medium">Over 10,000+ users</div>
                    </div>
                </div>

                {/* Bottom Footer Area */}
                <div className="relative z-10 flex justify-between text-sm text-indigo-200">
                    <span>&copy; {new Date().getFullYear()} Kinetic Inc.</span>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
                        <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50/50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo (hidden on desktop) */}
                    <div className="flex lg:hidden items-center space-x-2 mb-10 justify-center">
                        <div className="w-10 h-10 bg-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                            <Hexagon className="w-6 h-6 text-white fill-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">Kinetic</span>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                {isSignUp ? 'Create an account' : 'Welcome back'}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {isSignUp ? 'Start your journey with Kinetic.' : 'Log in to your account to continue'}
                            </p>
                            {errorMsg && (
                                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {errorMsg}
                                </div>
                            )}
                        </div>

                        {/* SSO Buttons */}
                        <div className="space-y-3 mb-8">
                            <button 
                                onClick={signInWithGoogle}
                                type="button"
                                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Continue with Google</span>
                            </button>
                            <button 
                                onClick={signInWithGithub}
                                type="button"
                                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span>Continue with GitHub</span>
                            </button>
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-400 text-xs font-semibold uppercase tracking-wider">Or continue with</span>
                            </div>
                        </div>

                        {/* Standard Form Component */}
                        <form className="space-y-5" onSubmit={handleEmailAuth}>
                            {isSignUp && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="fullName">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <input
                                                id="fullName"
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="username">Username</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                                <AtSign className="h-5 w-5" />
                                            </div>
                                            <input
                                                id="username"
                                                type="text"
                                                required
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                                                className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm"
                                                placeholder="janedoe123"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                                    {isSignUp ? "Email Address" : "Email or Username"}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        type={isSignUp ? "email" : "text"}
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm"
                                        placeholder={isSignUp ? "name@company.com" : "Email or Username"}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                                    {!isSignUp && <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</a>}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm"
                                        placeholder={isSignUp ? "Must be at least 6 characters" : "••••••••"}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Log In')}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                        <button 
                            onClick={() => setIsSignUp(!isSignUp)} 
                            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            {isSignUp ? 'Log in here' : 'Sign up today'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

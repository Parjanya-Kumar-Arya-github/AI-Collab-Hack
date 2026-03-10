import React from 'react';
import HeroShader from './HeroShader';

const Hero = () => {
    return (
        <div className="relative w-full min-h-[120vh] pt-[120px] pb-20 flex flex-col items-center justify-center overflow-hidden">
            <HeroShader />

            <div className="relative z-10 flex flex-col items-center text-center max-w-[800px] px-6 mx-auto mix-blend-multiply">
                <a href="#" className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-sm mb-10 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <span className="bg-[#1a1a1a] text-white text-[10px] font-bold px-[7px] py-[3px] rounded-[5px] uppercase tracking-wider">Live</span>
                    <span className="text-[13px] font-medium text-gray-500 opacity-90 group-hover:opacity-100 transition-opacity">Intelligent Team Matchmaking is here &rarr;</span>
                </a>

                <h1 className="text-[72px] leading-[1.05] font-medium tracking-[-0.035em] text-[#1a1a1a] mb-7">
                    Build <em className="tracking-tight" style={{ fontFamily: "Georgia, serif" }}>winning</em> teams<br />
                    driven by AI.
                </h1>

                <p className="text-[21px] leading-[1.4] text-gray-500 max-w-[500px] mb-12">
                    Stop struggling with manual group formation. Connect with perfectly balanced, verified peers for your next hackathon or research project.
                </p>

                <form className="relative w-full max-w-[460px] flex items-center bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-1.5 mb-10 border border-gray-100/50">
                    <input
                        type="email"
                        placeholder="Enter your university email"
                        className="flex-1 bg-transparent px-5 py-3 text-[16px] text-gray-900 placeholder-gray-400 outline-none"
                        required
                    />
                    <button type="submit" className="px-6 py-[14px] bg-[#1a1a1a] text-white text-[15px] font-medium rounded-xl hover:bg-black transition-colors whitespace-nowrap tracking-wide shadow-sm">
                        Find My Team
                    </button>
                </form>

                <div className="flex items-center gap-5 text-[13px] font-medium text-gray-400/80">
                    <div className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /><path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9" /><path d="M15 9V15L12 15" /></svg>
                        <div className="flex text-[#1a1a1a] text-sm">
                            {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                        </div>
                    </div>
                    <div className="w-px h-3.5 bg-gray-300/60"></div>
                    <div className="flex items-center gap-1.5 opacity-80">
                        <span>Skills actively verified via</span>
                        <span className="font-bold text-[#1a1a1a] text-[17px] tracking-tight ml-1" style={{ fontFamily: "Arial, sans-serif" }}>GitHub.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
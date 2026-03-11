import React, { useEffect, useRef, useState } from 'react';

// Custom CSS for the marquee animation to keep the JSX clean
const marqueeStyles = `
  @keyframes scrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes scrollRight {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .animate-scroll-left {
    display: flex;
    width: max-content;
    animation: scrollLeft 40s linear infinite;
  }
  .animate-scroll-right {
    display: flex;
    width: max-content;
    animation: scrollRight 40s linear infinite;
  }
  .marquee-container:hover .animate-scroll-left,
  .marquee-container:hover .animate-scroll-right {
    animation-play-state: paused;
  }
`;

const SignalCard = ({ color, text }) => (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-700/50 rounded-xl py-3 px-5 whitespace-nowrap shadow-sm mx-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></div>
        <p className="text-[15px] font-medium text-gray-200 m-0">{text}</p>
    </div>
);

const FeaturesSection = () => {
    // Row 1 Data
    const row1Signals = [
        { color: "#ff91be", text: "Alana linked her GitHub profile" },
        { color: "#659b5e", text: "Team Alpha needs a UI Designer" },
        { color: "#fbc768", text: "Vicky reached a 1500 Elo Rating" },
        { color: "#e6e199", text: "SAH 2.0 Hackathon registration open" },
        { color: "#e16540", text: "Ian is looking for a Web3 Backend Dev" },
        { color: "#f0bcd4", text: "Helen shared a React component" },
        { color: "#81e4ba", text: "Match: 95% compatibility with Mark" },
        { color: "#ff885c", text: "Bob verified his Codeforces account" },
    ];

    // Row 2 Data
    const row2Signals = [
        { color: "#9999fe", text: "Tom formed 'The Innovators' team" },
        { color: "#ecc07f", text: "Sue joined the 'Machine Learning' domain" },
        { color: "#7fa392", text: "Checkpoint 1 passed by Team Beta" },
        { color: "#328efa", text: "Mandy left a 5-star peer review" },
        { color: "#ff91be", text: "Tim is asking for PyTorch recommendations" },
        { color: "#aca2e1", text: "Emma updated her Skill Weightage" },
        { color: "#cace04", text: "John viewed your Smart Match profile" },
        { color: "#95d1fd", text: "Champion Ella secured 1st Place" },
    ];

    return (
        <section className="bg-black w-full pt-24 pb-0 relative overflow-hidden font-sans">
            <style>{marqueeStyles}</style>

            <div className="max-w-[1440px] mx-auto px-6">

                {/* Header Content */}
                <div className="flex flex-col items-center justify-center mb-24">
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700/50 bg-gray-900/50 mb-6">
                            <span className="bg-gradient-to-r from-[#E8400D] via-[#FFEED8] to-[#D0B2FF] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                NEW
                            </span>
                            <span className="text-sm font-medium text-gray-300 opacity-80">
                                AI Team Architect
                            </span>
                        </div>

                        <h2 className="text-[44px] md:text-[56px] leading-[1.1] text-white text-center font-medium max-w-[800px] tracking-tight mb-6">
                            Transform the way you build with <span className="font-serif italic text-gray-300">MERIDIAN</span> Matchmaking
                        </h2>

                        <p className="text-[18px] text-gray-400 text-center max-w-[500px] mb-10 leading-relaxed">
                            Stop guessing. Connect instantly with verified peers using dynamic skill clustering and real-time competency data.
                        </p>

                        <a href="#register" className="bg-white text-black px-8 py-3.5 rounded-xl font-medium text-[15px] hover:bg-gray-100 transition-colors shadow-lg">
                            Discover Smart Match
                        </a>
                    </div>
                </div>

                {/* Animated Marquee Section */}
                <div className="py-20 border-t border-gray-800 relative">
                    <h3 className="text-2xl text-white opacity-60 font-medium text-center mb-12">
                        Real-time collaboration signals
                    </h3>

                    <div className="relative marquee-container flex flex-col gap-6 overflow-hidden w-full max-w-[1200px] mx-auto">

                        {/* Gradient shadows for smooth fade on edges */}
                        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

                        {/* Top Row - Scrolls Left */}
                        <div className="animate-scroll-left">
                            {/* Render array twice to create a seamless infinite loop */}
                            {[...row1Signals, ...row1Signals, ...row1Signals].map((signal, idx) => (
                                <SignalCard key={idx} color={signal.color} text={signal.text} />
                            ))}
                        </div>

                        {/* Bottom Row - Scrolls Right */}
                        <div className="animate-scroll-right">
                            {/* Render array twice to create a seamless infinite loop */}
                            {[...row2Signals, ...row2Signals, ...row2Signals].map((signal, idx) => (
                                <SignalCard key={idx} color={signal.color} text={signal.text} />
                            ))}
                        </div>

                    </div>
                </div>

                {/* Testimonial Section */}
                <div className="pt-20 pb-32 flex justify-center border-t border-gray-800">
                    <div className="max-w-[800px] flex flex-col items-center">
                        <p className="text-[28px] md:text-[36px] text-white text-center leading-[1.3] font-medium tracking-tight mb-12">
                            “MERIDIAN is like having a super assistant that doesn’t sleep. The AI is top-notch, helping me find the exact UI/UX skills my team was missing to build a winning MVP.”
                        </p>

                        <div className="flex items-center gap-4">
                            {/* Placeholder Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8400D] to-[#D0B2FF] flex items-center justify-center text-white font-bold text-lg">
                                SJ
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white text-[16px] font-medium">Sarah J.</span>
                                <span className="text-gray-400 text-[15px]">Full-Stack Developer & SIH Winner</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
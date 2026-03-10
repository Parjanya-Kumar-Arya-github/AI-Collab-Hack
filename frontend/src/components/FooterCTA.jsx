import React, { useEffect, useRef } from 'react';

const FooterCTA = () => {
    const gradientTextRef = useRef(null);

    useEffect(() => {
        const element = gradientTextRef.current;
        if (!element) return;

        // Function to interpolate between two values
        function interpolate(value1, value2, factor) {
            return value1 + (value2 - value1) * factor;
        }

        // Function to generate random values within a given range
        function getRandom(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Function to apply easing for smoother transitions
        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        function animateRandomGradient(duration, previousStop1, previousStop2, previousX, previousY, el) {
            if (!el) return;

            // Set more controlled random stop points to balance the color distribution
            const newStop1 = getRandom(35, 55);
            const newStop2 = getRandom(85, 100);

            // Set more controlled random positions to prevent too much bias to any one color
            const newX = getRandom(30, 70);
            const newY = getRandom(30, 70);

            const startTime = performance.now();

            function updateGradient(currentTime) {
                const elapsedTime = currentTime - startTime;
                const factor = Math.min(elapsedTime / duration, 1);
                const easedFactor = easeInOutQuad(factor);

                const stop1 = interpolate(previousStop1, newStop1, easedFactor);
                const stop2 = interpolate(previousStop2, newStop2, easedFactor);
                const posX = interpolate(previousX, newX, easedFactor);
                const posY = interpolate(previousY, newY, easedFactor);

                if (el && el.style) {
                    el.style.setProperty('--gradient-stop1', `${stop1}%`);
                    el.style.setProperty('--gradient-stop2', `${stop2}%`);
                    el.style.setProperty('--gradient-posX', `${posX}%`);
                    el.style.setProperty('--gradient-posY', `${posY}%`);
                }

                if (factor < 1) {
                    requestAnimationFrame(updateGradient);
                } else {
                    animateRandomGradient(duration, newStop1, newStop2, newX, newY, el);
                }
            }

            requestAnimationFrame(updateGradient);
        }

        // Initial stop points and gradient position
        const initialStop1 = 49.83;
        const initialStop2 = 99.99;
        const initialX = 54.31;
        const initialY = 61.46;

        animateRandomGradient(1000, initialStop1, initialStop2, initialX, initialY, element);
    }, []);

    return (
        <section className="bg-black py-24 px-4 w-full">
            <style dangerouslySetInnerHTML={{
                __html: `
                .animated-gradient-text {
                    color: transparent;
                    background: radial-gradient(
                        100% 100% at var(--gradient-posX, 50%) var(--gradient-posY, 50%),
                        #FF885C 0%,
                        #D0B2FF var(--gradient-stop1, 50%),
                        #FFEED8 var(--gradient-stop2, 100%)
                    );
                    -webkit-background-clip: text;
                    background-clip: text;
                    position: relative;
                    display: inline-block;
                    /* Optional subtle drop shadow for glow */
                    filter: drop-shadow(0px 0px 8px rgba(208, 178, 255, 0.4));
                }
            `}} />
            <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center pt-10">

                {/* Headline */}
                <h2 className="text-white text-[48px] md:text-[64px] font-bold text-center tracking-tight leading-[1] uppercase mb-12">
                    Unlock your AI<br />team <span ref={gradientTextRef} className="animated-gradient-text">superpowers</span>
                </h2>

                {/* Email Form Wrapper */}
                <div className="w-full max-w-[640px] bg-white/5 rounded-[12px] p-2 flex flex-col gap-4 border border-white/10 shadow-2xl relative z-10 backdrop-blur-xl mb-32">
                    <form className="flex flex-col md:flex-row gap-2 w-full">
                        <input
                            type="email"
                            placeholder="Enter your university email"
                            required
                            className="flex-1 bg-[#1a1a1a] text-white border border-white/20 rounded-[8px] px-4 py-3 md:py-4 text-[15px] focus:outline-none focus:border-white/40 transition-colors placeholder:text-gray-500 font-medium"
                        />
                        <button
                            type="submit"
                            className="bg-white text-black font-medium text-[15px] px-6 py-3 md:py-4 rounded-[8px] hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                        >
                            Start matching <span className="text-[17px]">🚀</span>
                        </button>
                    </form>

                    {/* Social Proof Strip */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white/60 text-[13px] font-medium pt-2 pb-2">
                        <div className="flex items-center gap-2">
                            <img src="https://cdn.prod.website-files.com/6350808bc45bd0c902af10e6/66a3b9b79fd4fe04bcc54f09_g2-stars-white.svg" alt="5 stars G2" className="h-[14px]" />
                        </div>
                        <div className="hidden md:block w-px h-[14px] bg-white/20"></div>
                        <div className="flex items-center gap-2">
                            <span>Rated #1 Team Builder by</span>
                            <span className="font-bold text-white tracking-wider text-[14px] ml-1">MERIDIAN</span>
                        </div>
                    </div>
                </div>

                {/* Footer Links Row */}
                <div className="w-full border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-white/50 font-medium">
                    <div>© 2026 MERIDIAN</div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">GDPR</a>
                        <a href="#" className="hover:text-white transition-colors">CCPA</a>
                        <a href="#" className="hover:text-white transition-colors">Trust and Security</a>
                        <a href="#" className="hover:text-white transition-colors">Do Not Sell My Info</a>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FooterCTA;

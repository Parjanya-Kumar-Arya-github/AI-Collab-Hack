import React from 'react';

const testimonialsCol1 = [
    {
        name: "Aidan Aguirre",
        role: "Computer Science Major",
        company: "MIT",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866e4719466445d9882817d_am-aidan-aguirre.avif",
        quote: "MERIDIAN is one of the easiest matchmaking platforms I have used to date. I instantly fell in love with the verified GitHub integrations and the hyper-relevant skill filtering."
    },
    {
        name: "Agnieszka Hayashida",
        role: "UX/UI Designer",
        company: "HackMIT Winner",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866e3e299d75de67b2f5088_am-agnieszka-hayashida.avif",
        quote: "The UI is clean, intuitive, and makes finding teammates really easy. It saves me hours of networking at the start of every hackathon."
    },
    {
        name: "Alexandra Giraldo",
        role: "Event Organizer",
        company: "HackTheNorth",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/684060d511c1d852205c0780_Rectangle%207483.avif",
        quote: "We used to rely on chaotic Discord channels and spreadsheets to help attendees form teams. Now we just tell them to use MERIDIAN to do it all."
    },
    {
        name: "Aline Louzada",
        role: "Data Scientist",
        company: "Stanford",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866bcf95bc1dad301cb8857_am-aline-louzada.avif",
        quote: "MERIDIAN is very easy to use, and the platform is user-friendly. It provides us with a high-quality list of potential research partners based purely on academic data."
    }
];

const testimonialsCol2 = [
    {
        name: "Dan Rhondeau",
        role: "Full Stack Developer",
        company: "Independent",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/684062621087b66b47f769be_6840416b095720647c683960_Dan-Buwelo.avif",
        quote: "MERIDIAN helped us find a specialized ML engineer we wouldn’t have otherwise found, leading to a 1st place overall finish. Love it!"
    },
    {
        name: "Emilien Cheveux",
        role: "Product Manager",
        company: "TechStars",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866ba0d207ef840718fd241_am-emilien-cheveux.avif",
        quote: "I like that you don’t have to use multiple tools. You don't need Discord, LinkedIn, and spreadsheets to vet teammates anymore."
    },
    {
        name: "Erica Templeton",
        role: "AI Researcher",
        company: "Berkeley",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866b4b5ce2388e9fd5cdf1f_am-erica-templeton.avif",
        quote: "MERIDIAN allows us to build perfectly balanced, multidisciplinary teams as though we have a massive professional network."
    },
    {
        name: "Evan West",
        role: "Backend Dev",
        company: "Codeforces Expert",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866bad3f62e82a00919efcd_am-evan-west.avif",
        quote: "The peer review system means I never get stuck with dead-weight teammates anymore. Accountability is finally built into group projects."
    }
];

const testimonialsCol3 = [
    {
        name: "Lewis Bell",
        role: "Frontend Engineer",
        company: "React Nexus",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866c0a352e7dbab5d10859b_am-lewis-bell.avif",
        quote: "The GitHub integration proves exactly what someone can do. It removes the stress of wondering if your teammate can actually code what they claim."
    },
    {
        name: "Lucas Summers",
        role: "Machine Learning",
        company: "AI Labs",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/684062e3827018860dac801c_6840411a7dd8973225c36aa7_Lucas-HPE.avif",
        quote: "I went from spending half my weekend trying to find a team, to having 3 perfectly matched invites within 10 minutes of creating my MERIDIAN profile."
    },
    {
        name: "Mari-Liis Põldar",
        role: "3D Artist",
        company: "Creative Connect",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866bfb07832d7e673ffcffd_am-mari-liis-poldar.avif",
        quote: "MERIDIAN really seems to be the game-changer in hackathons. I love that developers can filter specifically to find designers like me!"
    },
    {
        name: "Thomas Wood",
        role: "Blockchain Dev",
        company: "Web3 Builders",
        image: "https://cdn.prod.website-files.com/6350808bc45bd01da7af10ea/6866be9339c8e6ea084e9041_am-thomas-wood.avif",
        quote: "We tested many different platforms for finding project collaborators and turned back to MERIDIAN every time!"
    }
];

const TestimonialCard = ({ data }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6 flex flex-col gap-6 w-full max-w-[400px]">
        <div className="flex items-center gap-4">
            <img src={data.image} alt={data.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex flex-col">
                <span className="text-white text-[15px] font-medium">{data.name}</span>
                <span className="text-gray-400 text-[14px]">
                    {data.role} at <span className="text-white">{data.company}</span>
                </span>
            </div>
        </div>
        <p className="text-[17px] text-gray-300 leading-relaxed m-0">
            {data.quote}
        </p>
    </div>
);

const WallOfLove = () => {
    return (
        <section className="bg-black py-24 relative overflow-hidden font-sans">
            <style>{`
                @keyframes scrollUp {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes scrollDown {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0); }
                }
                .animate-scroll-up {
                    animation: scrollUp 20s linear infinite;
                }
                .animate-scroll-down {
                    animation: scrollDown 20s linear infinite;
                }
                .column-container:hover .animate-scroll-up,
                .column-container:hover .animate-scroll-down {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-[1440px] mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-16 relative z-10">
                    <h2 className="text-[36px] md:text-[44px] text-white text-center font-medium max-w-[400px] tracking-tight">
                        Some love from our community!
                    </h2>
                </div>

                {/* Grid Container */}
                <div className="relative h-[800px] overflow-hidden flex gap-6 justify-center max-w-[1250px] mx-auto column-container">

                    {/* Top and Bottom Fades */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

                    {/* Column 1 (Scrolls Up) */}
                    <div className="w-full max-w-[400px] animate-scroll-up flex flex-col">
                        {[...testimonialsCol1, ...testimonialsCol1].map((data, idx) => (
                            <TestimonialCard key={`col1-${idx}`} data={data} />
                        ))}
                    </div>

                    {/* Column 2 (Scrolls Down) - Hidden on Mobile */}
                    <div className="w-full max-w-[400px] animate-scroll-down flex flex-col hidden md:flex">
                        {[...testimonialsCol2, ...testimonialsCol2].map((data, idx) => (
                            <TestimonialCard key={`col2-${idx}`} data={data} />
                        ))}
                    </div>

                    {/* Column 3 (Scrolls Up) - Hidden on smaller screens */}
                    <div className="w-full max-w-[400px] animate-scroll-up flex flex-col hidden lg:flex">
                        {[...testimonialsCol3, ...testimonialsCol3].map((data, idx) => (
                            <TestimonialCard key={`col3-${idx}`} data={data} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WallOfLove;
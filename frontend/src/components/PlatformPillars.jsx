import React, { useState } from 'react';

const cardsData = [
    {
        id: 'engagement',
        title: 'Smart Pairing',
        heading: 'Find your perfect hackathon team',
        desc: 'Tell the AI agent what event you are joining, and it instantly matches you with 3-4 optimal teams based on complementary skill requirements and peer ratings.',
        color: '#FBC768', // Yellow
        imgSrc: 'https://cdn.prod.website-files.com/6350808bc45bd0c902af10e6/66d8521c045f8c25bce2f560_e7dcd342ab18d6fd2cd2dba19afa8e71_am-pillars-engagement.avif'
    },
    {
        id: 'deliverability',
        title: 'Smart Rating & Verification',
        heading: 'Verified skills, zero fluff',
        desc: 'Move beyond self-reported skills. The AI actively verifies achievements by scanning GitHub repos, LeetCode, and Codeforces to ensure you team up with proven talent.',
        color: '#81E4BA', // Green
        imgSrc: 'https://cdn.prod.website-files.com/6350808bc45bd0c902af10e6/66d8527858306c25b412be9c_088b0d5bd8a3aec32d46f572ae7e1f89_am-pillars-deliver.avif',
        imgOverlay: 'https://cdn.prod.website-files.com/6350808bc45bd0c902af10e6/68348668e6bcbd7f4329cc30_d043a27e8238a847ba9ca47c2a393b75_am-pillars-deliverability-modal.avif'
    },
    {
        id: 'intelligence',
        title: 'Research Collab',
        heading: 'Interdisciplinary matchmaking',
        desc: 'Need a data analyst for your robotics project? Set your specific academic requirements, and the AI will find 4-5 highly relevant researchers with complementary backgrounds.',
        color: '#9999FE', // Blue/Purple
        imgSrc: 'https://cdn.prod.website-files.com/6350808bc45bd0c902af10e6/68347d40d2a19e93368d750f_13589317ed068fe774b5b1894f5350c8_am-pillars-intelligence.avif'
    },
    {
        id: 'leadgen',
        title: 'Leaderboards & Peer Review',
        heading: 'Build your STEM reputation',
        desc: 'Climb domain-based podiums (e.g., "Best UI/UX") and build lasting trust through our Elo-style peer feedback system after every successful hackathon.',
        color: '#FF885C', // Orange
        imgSrc: 'https://cdn.prod.website-files.com/6350808bc45bd0c902af10e6/6703adfe152b12a2124286cf_adec0ef970ca2c699e892b6b7ecb3a3d_am-pillars-leadgen.avif'
    }
];

const PlatformPillars = () => {
    const [order, setOrder] = useState(['engagement', 'deliverability', 'intelligence', 'leadgen']);
    const [hoveredCard, setHoveredCard] = useState(null);

    const getPosStyle = (id) => {
        const pos = order.indexOf(id);
        const isFront = pos === 0;

        const yOffsets = [150, 75, 35, 0];
        const scales = [1, 0.96, 0.92, 0.88];
        const zIndexes = [40, 30, 20, 10];

        const hoverLift = (!isFront && hoveredCard === id) ? -12 : 0;

        return {
            zIndex: zIndexes[pos],
            transform: `translateY(${yOffsets[pos] + hoverLift}px) scale(${scales[pos]})`,
            transformOrigin: 'top center',
        };
    };

    const handleCardClick = (id) => {
        const pos = order.indexOf(id);
        if (pos === 0) return;

        setOrder(prev => {
            return [id, ...prev.filter(c => c !== id)];
        });
    };

    return (
        <section className="relative w-full pb-32 pt-20 px-4 md:px-0 overflow-hidden bg-white/50">


            {/* Header Content */}
            <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center mb-16 px-4 relative z-10">
                <h2 className="text-[36px] md:text-[44px] text-center font-medium text-[#1a1a1a] tracking-tight text-wrap-balance mb-4">
                    A<span className="italic" style={{ fontFamily: "Georgia, serif" }}>ll</span>-in-<span className="italic" style={{ fontFamily: "Georgia, serif" }}>one</span> platform <br />to level up your <span className="italic" style={{ fontFamily: "Georgia, serif" }}>team</span> formation.
                </h2>
                <p className="text-[16px] text-gray-500 text-center max-w-[344px] mx-auto">
                    Give your users the power to match smarter and build faster from day one.
                </p>
            </div>

            {/* Interactive Stacked Cards */}
            <div className="relative w-full max-w-[1050px] mx-auto h-[600px] md:h-[750px] flex justify-center mt-8">
                {cardsData.map((card) => {
                    const isFront = order.indexOf(card.id) === 0;

                    return (
                        <div
                            key={card.id}
                            className="absolute top-0 inset-x-0 mx-auto w-full max-w-[1050px] min-h-[520px] bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-200/60 transition-all duration-500 ease-out cursor-pointer flex flex-col overflow-hidden"
                            style={getPosStyle(card.id)}
                            onMouseEnter={() => setHoveredCard(card.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => handleCardClick(card.id)}
                        >
                            {/* Card Header Tab */}
                            <div className="h-[64px] border-b border-gray-100 flex items-center px-8 gap-3 bg-white/80 backdrop-blur-md shrink-0">
                                <div
                                    className={`w-2.5 h-2.5 rounded-sm transform rotate-45 transition-opacity duration-300 ${isFront || hoveredCard === card.id ? 'opacity-100' : 'opacity-40'}`}
                                    style={{ backgroundColor: card.color }}>
                                </div>
                                <h3 className={`text-[15px] font-medium transition-colors duration-300 ${isFront || hoveredCard === card.id ? 'text-gray-900' : 'text-gray-500 select-none'}`}>
                                    {card.title}
                                </h3>
                            </div>

                            {/* Card Body */}
                            <div className={`flex flex-col lg:flex-row p-8 lg:p-12 gap-10 transition-opacity duration-500 h-full ${isFront ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                {/* Text Content */}
                                <div className="flex-[0.8] pt-2">
                                    <h4 className="text-[28px] lg:text-[36px] leading-[1.1] font-medium text-[#1a1a1a] mb-4 tracking-tight max-w-[270px]">
                                        {card.heading}
                                    </h4>
                                    <p className="text-[16px] text-gray-500 leading-[1.6] max-w-[400px]">
                                        {card.desc}
                                    </p>
                                </div>

                                {/* Image Visual */}
                                <div className="flex-[1.2] relative bg-[#fcfaf9] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-xl flex items-center justify-center overflow-hidden min-h-[250px] lg:min-h-full">
                                    <img src={card.imgSrc} alt={card.title} className="w-full h-auto object-cover max-h-full" />
                                    {card.imgOverlay && (
                                        <img
                                            src={card.imgOverlay}
                                            alt="Overlay"
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] rounded-lg shadow-2xl"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default PlatformPillars;
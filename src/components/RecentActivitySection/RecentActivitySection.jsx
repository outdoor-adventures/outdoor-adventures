import React from 'react';

const RecentActivitySection = () => {
    //  TODO: Replace placeholder with real data from backend once available
    const adventures = [];

    return (
        // Recent Activity section wrapper
        <section className="recent-activity">
            <h2 className="ra-title">Recent Activity</h2>

            {/* Cards container: challenge backend team to populate "adventures" array */}
            <div className="ra-cards">
                {adventures.map((item) => (
                    <div key={item.id} className="ra-card">
                        <img
                            src={item.img}
                            alt={item.title}
                            className="ra-card-img"
                        />
                        <h3 className="ra-card-title">{item.title}</h3>
                        <p className="ra-card-location">{item.location}</p>
                        <button className="ra-card-btn">View More</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentActivitySection;

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
import axios from "axios";
import Rating from "@mui/material/Rating";

const FireSafetyEngineering = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get("http://localhost:3001/api/reviews");

                const allFiveStar = res.data.filter(
                    (review) => review.service === "Fire Safety Engineering" && review.rating === 5 &&
                        review.featured
                );


                setReviews(allFiveStar.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        };

        fetchReviews();
    }, []);


    const sliderSettings = {
        dots: true,
        infinite: reviews.length > 1,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <section className="customer-reviews-section">
                <h2 className="customer-reviews-title">Customer Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="carousel-wrapper">
                        <Slider {...sliderSettings}>
                            {reviews.map((review, index) => (
                                <div key={index} className="p-4 bg-gray-100 rounded shadow">
                                    <p className="italic">"{review.description}"</p>
                                    <p className="mt-2 font-semibold text-right">
                                        By <span style={{ fontWeight: "bold" }}>{review.name}</span>
                                        {review.company ? (
                                            <> from <span style={{ fontWeight: "bold" }}>{review.company}</span></>
                                        ) : ""}
                                    </p>
                                    <Rating value={review.rating} readOnly precision={1} size="large" sx={{ mb: 1, fontSize: 36 }} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <p>No 5-star reviews available yet.</p>
                )}

            </section>
            <section>
                <h1 className="text-3xl font-bold mb-4">Fire Safety Engineering</h1>
                <p>
                    We provide Fire Safety Engineering (FSE) Service for the performance-based (PB) alternative
                    solutions for fire safety design. The PB approach relies on the use of fire engineering principles,
                    calculations and/or appropriate software modelling tools to satisfy the intentions of the Code
                    of Practice for Fire Precautions in Buildings 2013 (Fire Code). This new approach provides
                    alternative means of meeting the intentions of the Fire Code. Building practitioners will have the
                    added flexibility in the application of fire safety for their buildings by having a choice of using
                    the performance-based approach, the prescriptive approach or a combination of both.
                </p>
            </section>
                <br></br>
                <br></br>
            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">FSE Services Include</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>
                        Full FSE service, including consultation with SCDF, Fire Engineering Design Brief (FEDB),
                        Fire Safety Engineering Design Report (FSER)/Operation & Maintenance Manual (OMM), and
                        obtaining SCDF approval for respective FEDB, FSER/OMM submissions.
                    </li>
                    <li>
                        Letter of NO Objection (LoNO) - FSE Assessment of QP submission of the existing building with PB solutions.
                    </li>
                    <li>
                        FSE Assessment and assisting QP waiver submission.
                    </li>
                    <li>
                        Peer Reviewer (PR) service for the 3rd party assessment and review of the FSE submission of
                        FEDB, FSER/OMM of a PB project.
                    </li>
                    <li>
                        RI (FSE) - Registered Inspector service for PB projects.
                    </li>
                </ul>
            </section>


            <br></br>
            <br></br>

            <section>
                <h3 className="text-xl font-semibold mt-4">Commercial</h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "24px",
                    alignItems: "start",
                    marginBottom: "2rem"
                }}>
                    <ul className="list-disc list-inside">
                        <li>Gardens by the Bay</li>
                        <li>Jurong Point</li>
                        <li>City Square Mall</li>
                        <li>Star Vista</li>
                    </ul>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <img src="gardens1.png" alt="Gardens by the Bay" style={{ width: "48%", borderRadius: 8 }} />
                        <img src="gardens2.png" alt="City Square Mall" style={{ width: "48%", borderRadius: 8 }} />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold mt-4">Infrastructural</h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "24px",
                    alignItems: "start",
                    marginBottom: "2rem"
                }}>
                    <ul className="list-disc list-inside">
                        <li>Kim Chuan Depot</li>
                        <li>GalBatu Depot</li>
                    </ul>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <img src="inf1.png" alt="Kim Chuan Depot" style={{ width: "48%", borderRadius: 8 }} />
                        <img src="inf2.png" alt="GalBatu Depot" style={{ width: "48%", borderRadius: 8 }} />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold mt-4">Industrial</h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "24px",
                    alignItems: "start",
                    marginBottom: "2rem"
                }}>
                    <ul className="list-disc list-inside">
                        <li>Harvest @ Woodlands</li>
                        <li>IKEA</li>
                        <li>CWT's Warehouses</li>
                    </ul>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <img src="ind1.png" alt="Harvest @ Woodlands" style={{ width: "48%", borderRadius: 8 }} />
                        <img src="ind2.png" alt="IKEA" style={{ width: "48%", borderRadius: 8 }} />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold mt-4">Institutional</h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "24px",
                    alignItems: "start",
                    marginBottom: "2rem"
                }}>
                    <ul className="list-disc list-inside">
                        <li>Singapore Expo</li>
                        <li>Singapore Air-Show</li>
                        <li>Sport Hub</li>
                        <li>Changi Airport T1</li>
                    </ul>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <img src="inst1.png" alt="Singapore Expo" style={{ width: "48%", borderRadius: 8 }} />
                        <img src="inst2.png" alt="Changi Airport T1" style={{ width: "48%", borderRadius: 8 }} />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold mt-4">Residential</h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "24px",
                    alignItems: "start",
                    marginBottom: "2rem"
                }}>
                    <ul className="list-disc list-inside">
                        <li>Garden Vista</li>
                        <li>One Shenton</li>
                        <li>Marina One</li>
                    </ul>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <img src="res1.png" alt="Garden Vista" style={{ width: "48%", borderRadius: 8 }} />
                        <img src="res2.png" alt="Marina One" style={{ width: "48%", borderRadius: 8 }} />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold mt-4">Special Projects</h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "24px",
                    alignItems: "start",
                    marginBottom: "2rem"
                }}>
                    <ul className="list-disc list-inside">
                        <li>SMU-X</li>
                        <li>BCAA</li>
                        <li>Eunoia Junior College</li>
                    </ul>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <img src="spec1.png" alt="SMU-X" style={{ width: "48%", borderRadius: 8 }} />
                        <img src="spec2.png" alt="Eunoia Junior College" style={{ width: "48%", borderRadius: 8 }} />
                    </div>
                </div>
            </section>
        </div >
    );
}

export default FireSafetyEngineering;

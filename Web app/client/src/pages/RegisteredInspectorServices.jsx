import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
import axios from "axios";
import Rating from "@mui/material/Rating";


const RegisteredInspectorServices = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get("http://localhost:3001/api/reviews");

                const allFiveStar = res.data.filter(
                    (review) => review.service === "Registered Inspector Services" && review.rating === 5 &&
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
                <h1 className="text-3xl font-bold mb-4">Registered Inspector Services</h1>
                <p>
                    An inspection certificate issued by a Registered Inspector (RI) is a prerequisite for the
                    issuance of a Temporary Fire Permit (TFP) or a Fire Safety Certificate (FSC) for a building
                    project. Owners are therefore required to engage RIs to inspect and certify their projects
                    before submitting their application for a TFP / FSC to SCDF.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">RI (ME)</h2>
                <p>
                    We provide inspection and certification of fire safety works as defined in the Fire Safety
                    (Registered Inspectors) Regulations including any or any combination of the followings:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                        <strong>Fire Protection (FP) Services</strong>: Automatic Sprinkler Installations,
                        Hose-reel, Dry/Wet risers installations, Automatic Fire Alarm installation, Wet
                        Chemical/Gas fire suppression system, Emergency Voice Communication systems.
                    </li>
                    <li>
                        <strong>Mechanical Ventilation (MV) System</strong>: Air-conditioning and Mechanical
                        Ventilation systems, Car-Park Ventilation systems, Smoke Control Systems.
                    </li>
                    <li>
                        <strong>Electrical Supplies</strong>: Emergency Power supplies, and cabling works to the
                        FP and MV systems.
                    </li>
                    <li>
                        <strong>Combined Tests</strong>: MEP installations and other systems such as lifts,
                        escalators, generators, emergency lights, electro-mechanical locking devices.
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">RI (FSE)</h2>
                <p>
                    We also provide inspection and certification for the Performance-Based Alternative
                    Solutions fire safety works.
                </p>
            </section>

            {/* Selected Projects Section with Grid Layout */}
            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">Selected Projects</h2>
                <ul className="list-disc list-inside space-y-1" style={{ fontWeight: 600, color: "#228B22" }}>
                    <li>MRT Thomson Line</li>
                    <li>Marina Bay Sand</li>
                    <li>Sport Hub</li>
                    <li>Outram Community Hospital</li>
                    <li>Paya Lebar Quarter</li>
                    <li>Changi Airport Terminal 1</li>
                    <li>Mandai Zoo/Bird Park</li>
                </ul>
                <div
                    style={{
                        display: "flex",
                        gap: "32px",
                        flexWrap: "nowrap",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        marginTop: "2rem",
                        overflowX: "auto"
                    }}
                >
                    <img src="TEline.png" alt="MRT Thomson Line" style={{ width: "32%", minWidth: 260, borderRadius: 8 }} />
                    <img src="BirdPark.png" alt="Mandai Zoo/Bird Park" style={{ width: "32%", minWidth: 260, borderRadius: 8 }} />
                    <img src="Sportshub.png" alt="Sport Hub" style={{ width: "32%", minWidth: 260, borderRadius: 8 }} />
                    {/* Add or adjust images as needed */}
                </div>
            </section >
        </div >
    );
};

export default RegisteredInspectorServices;

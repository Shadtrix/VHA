import React, {useEffect, useState} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
import axios from "axios";

const FireSafetyEngineering = () => {
   const [reviews, setReviews] = useState([]);

    useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/reviews");

        const allFiveStar = res.data.filter(
          (review) => review.service === "Fire Safety Engineering" && review.rating === 5
        );

        const featuredReviews = allFiveStar.filter(r => r.featured);
        const nonFeaturedReviews = allFiveStar.filter(r => !r.featured);

        let finalReviews = featuredReviews.sort(() => 0.5 - Math.random());

        if (finalReviews.length < 3) {
          const shuffled = nonFeaturedReviews.sort(() => 0.5 - Math.random());
          const needed = 3 - finalReviews.length;
          finalReviews = finalReviews.concat(shuffled.slice(0, needed));
        }

        setReviews(finalReviews.slice(0, 3));
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
                                        By {review.name}
                                        {review.company ? ` from ${review.company}` : ""}
                                    </p>
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

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">Selected Projects</h2>

                <h3 className="text-xl font-semibold mt-4">Commercial</h3>
                <ul className="list-disc list-inside">
                    <li>Gardens by the Bay</li>
                    <li>Jurong Point</li>
                    <li>City Square Mall</li>
                    <li>Star Vista</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">Infrastructural</h3>
                <ul className="list-disc list-inside">
                    <li>Kim Chuan Depot</li>
                    <li>GalBatu Depot</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">Industrial</h3>
                <ul className="list-disc list-inside">
                    <li>Harvest @ Woodlands</li>
                    <li>IKEA</li>
                    <li>CWT's Warehouses</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">Institutional</h3>
                <ul className="list-disc list-inside">
                    <li>Singapore Expo</li>
                    <li>Singapore Air-Show</li>
                    <li>Sport Hub</li>
                    <li>Changi Airport T1</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">Residential</h3>
                <ul className="list-disc list-inside">
                    <li>Garden Vista</li>
                    <li>One Shenton</li>
                    <li>Marina One</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">Special Projects</h3>
                <ul className="list-disc list-inside">
                    <li>SMU-X</li>
                    <li>BCAA</li>
                    <li>Eunoia Junior College</li>
                </ul>

                <p className="italic text-sm mt-2">Photo taken from Beca FER Report</p>
            </section>
        </div>
    );
}

export default FireSafetyEngineering;

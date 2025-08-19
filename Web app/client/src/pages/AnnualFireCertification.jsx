import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
import axios from "axios";
import Rating from "@mui/material/Rating";

const AnnualFireCertification = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/reviews");

        const allFiveStar = res.data.filter(
          (review) => review.service === "Annual Fire Certification" && review.rating === 5 &&
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
      <div>
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
      </div>
      <section>
        <h1 className="text-3xl font-bold mb-4">Annual Fire Certification</h1>
        <p>
          Under Section 35 of the Fire Safety Act 1993, the owner or occupier of any public building such as offices, hospitals, shopping complexes, industrial buildings and private residential buildings that fall within the criteria define in the Act is required to apply and obtain a Fire Certificate (FC).  The Fire Certification Scheme ensures the proper maintenance and good working condition of fire safety systems.

          We are able to provide the annual inspection and testing service for all buildings and facilities, such as  an engineered timber building, a fully automated mechanized car park, that require to obtain FC.

          <br></br>
          <br></br>

          We are currently provide the FC inspection and tastings service for Marina Bay Sands, that include the hotel towers, exhibition centers, shopping centers, museum, carparking, F&B and the casinos...


        </p>
      </section>
    </div>
  );
};

export default AnnualFireCertification;

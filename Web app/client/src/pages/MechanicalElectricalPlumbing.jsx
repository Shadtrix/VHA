import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
import { Rating } from "@mui/material";

const MechanicalElectricalPlumbing = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/reviews");

        const allFiveStar = res.data.filter(
          (review) => review.service === "MEP Engineering" && review.rating === 5 &&
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
        <h1 className="text-3xl font-bold mb-4">MEP Engineering</h1>
        <p>
          Our Mechanical, Electrical, and Plumbing (MEP) Engineering services
          encompass a wide spectrum of building systems. We offer comprehensive
          design, inspection, and certification services across a variety of
          sectors including infrastructural, commercial, industrial,
          institutional, and residential developments. Our experienced team
          ensures all MEP systems meet the required codes and standards for
          safe and efficient operations.
        </p>
      </section>

<br></br>

         {/* Infrastructural */}
      <section>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Infrastructural</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
          marginBottom: "2rem"
        }}>
          <div>
            <strong>LTA MRT MEP, D&amp;B projects</strong>
            <ul className="list-disc list-inside">
              <li>Cross Island Line</li>
              <li>Jurong Region Line</li>
              <li>Tuas West Extension</li>
              <li>Thomson Line</li>
              <li>Downtown Line</li>
              <li>Circle Line</li>
              <li>Boon Lay extension</li>
              <li>Tuas Depot</li>
              <li>Kim Chuan Depot</li>
            </ul>
            <strong className="block mt-4">District Cooling</strong>
            <ul className="list-disc list-inside">
              <li>Woodland District Cooling plant</li>
              <li>Changi Business Park</li>
            </ul>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img src="infrastructural.png" alt="MRT Line" style={{ width: "100%", borderRadius: 8 }} />
            {/* Add more images as needed */}
          </div>
        </div>
      </section>

      <br></br>

      {/* Commercial */}
      <section>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Commercial</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
          marginBottom: "2rem"
        }}>
          <div>
            <strong>Shopping Malls</strong>
            <ul className="list-disc list-inside">
              <li>Jurong Point Shopping Centre</li>
              <li>Tiong Baharu Plaza</li>
              <li>White Sands Shopping Centre</li>
              <li>Liang Court</li>
              <li>Tampinese One</li>
              <li>Century Square</li>
            </ul>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img src="shoppingmall.png" alt="Jurong Point Shopping Centre" style={{ width: "100%", borderRadius: 8 }} />
          </div>
            <div>
            <strong className="block mt-4">Hotels</strong>
            <ul className="list-disc list-inside">
              <li>Naumi Hotel</li>
              <li>Movenpick Hotel, Sentosa</li>
              <li>Marco Polo Hotel, Xiamen</li>
              <li>Pacific Plaza service apartment, China</li>
              <li>Millennium Jakarta</li>
              <li>Genting Hotel</li>
              <li>Copthorne Orchid Hotel</li>
            </ul>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img src="hotels.png" alt="Genting Hotel" style={{ width: "100%", borderRadius: 8 }} />
            {/* Add more images as needed */}
          </div>
        </div>
      </section>

      <br></br>

      {/* Industrial */}
      <section>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Industrial</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
          marginBottom: "2rem"
        }}>
          <div>
            <ul className="list-disc list-inside">
              <li>Pfizer Utility Building</li>
              <li>Warehouse @ Tagore</li>
              <li>Sunray factory/warehouse</li>
              <li>Harvest @ Woodland</li>
            </ul>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img src="industrial.png" alt="Pfizer Utility Building" style={{ width: "100%", borderRadius: 8 }} />
            {/* Add more images as needed */}
          </div>
        </div>
      </section>

      <br></br>

      {/* Institutional */}
      <section>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Institutional</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
          marginBottom: "2rem"
        }}>
          <div>
            <ul className="list-disc list-inside">
              <li>MDIS, EduCity, Malaysia</li>
              <li>Woodlands Health Campus</li>
              <li>French International School</li>
              <li>Sport Hub</li>
              <li>BCA Academy</li>
              <li>Eunoia Junior College</li>
            </ul>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img src="institutional.png" alt="MDIS, EduCity, Malaysia" style={{ width: "100%", borderRadius: 8 }} />
            {/* Add more images as needed */}
          </div>
        </div>
      </section>

      <br></br>

      {/* Residential and Dormitory */}
      <section>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Residential and Dormitory</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
          marginBottom: "2rem"
        }}>
          <div>
            <ul className="list-disc list-inside">
              <li>EL Paso Luxury Condominiums, Abuja, Nigeria</li>
              <li>EcoGreen</li>
              <li>The Hyde</li>
              <li>DBSS upper Serangoon</li>
              <li>EC Punggol</li>
              <li>Shaw Road Dormitory</li>
            </ul>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img src="residential.png" alt="EL Paso Luxury Condominiums" style={{ width: "100%", borderRadius: 8 }} />
            {/* Add more images as needed */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MechanicalElectricalPlumbing;

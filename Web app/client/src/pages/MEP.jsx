import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MechanicalElectricalPlumbing = () => {
    const reviews = [
        {
            name: "Mr. Tan",
            text: "Professional service and thorough inspection. Highly recommended!",
        },
        {
            name: "Ms. Lim",
            text: "Quick response and helpful communication throughout the certification process.",
        },
        {
            name: "Building Corp Pte Ltd",
            text: "Their team is highly knowledgeable in fire safety compliance. We passed FSC smoothly!",
        },
    ];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <section className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
                <Slider {...sliderSettings}>
                    {reviews.map((review, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded shadow">
                            <p className="italic">"{review.text}"</p>
                            <p className="mt-2 font-semibold text-right">— {review.name}</p>
                        </div>
                    ))}
                </Slider>
            </section>
            <section>
                <h1 className="text-3xl font-bold mb-4">MEP Engineering</h1>
                <p>
                    Our Mechanical, Electrical, and Plumbing (MEP) Engineering services encompass a wide spectrum of building systems. We offer comprehensive design, inspection, and certification services across a variety of sectors including infrastructural, commercial, industrial, institutional, and residential developments. Our experienced team ensures all MEP systems meet the required codes and standards for safe and efficient operations.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">Infrastructural</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>LTA MRT MEP, D&B projects</li>
                    <li>Cross Island Line</li>
                    <li>Jurong Region Line</li>
                    <li>Tuas West Extension</li>
                    <li>Thomson Line</li>
                    <li>Downtown Line</li>
                    <li>Circle Line</li>
                    <li>Boon Lay extension</li>
                    <li>Tuas Depot</li>
                    <li>Kim Chuan Depot</li>
                    <li>District Cooling</li>
                    <li>Woodland District Cooling plant</li>
                    <li>Changi Business Park</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">Commercial</h2>
                <h3 className="text-xl font-semibold mt-2">Shopping Malls</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Jurong Point Shopping Centre</li>
                    <li>Tiong Baharu Plaza</li>
                    <li>White Sands Shopping Centre</li>
                    <li>Liang Court</li>
                    <li>Tampinese One</li>
                    <li>Century Square</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">Hotels</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Naumi Hotel</li>
                    <li>Movenpick Hotel, Sentosa</li>
                    <li>Marco Polo Hotel, Xiamen</li>
                    <li>Pacific Plaza service apartment, China</li>
                    <li>Millennium Jakarta</li>
                    <li>Genting Hotel</li>
                    <li>Copthorne Orchid Hotel</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">Industrial</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>Pfizer Utility Building</li>
                    <li>Warehouse @ Tagore</li>
                    <li>Sunray factory/warehouse</li>
                    <li>Harvest @ Woodland</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">Institutional</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>MDIS, EduCity, Malaysia</li>
                    <li>Woodlands Health Campus</li>
                    <li>French International School</li>
                    <li>Sport Hub</li>
                    <li>BCA Academy</li>
                    <li>Eunoia Junior College</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">Residential and Dormitory</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>EL Paso Luxury Condominiums, Abuja, Nigeria</li>
                    <li>EcoGreen</li>
                    <li>The Hyde</li>
                    <li>DBSS upper Serangoon</li>
                    <li>EC Punggol</li>
                    <li>Shaw Road Dormitory</li>
                </ul>
            </section>
        </div>
    );
};

export default MechanicalElectricalPlumbing;

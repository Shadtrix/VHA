import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AnnualFireCertification = () => {
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
                <h1 className="text-3xl font-bold mb-4">Annual Fire Certification</h1>
                <p>
                    Under Section 35 of the Fire Safety Act 1993, the owner or occupier of any public building such as offices, hospitals, shopping complexes, industrial buildings and private residential buildings that fall within the criteria define in the Act is required to apply and obtain a Fire Certificate (FC).  The Fire Certification Scheme ensures the proper maintenance and good working condition of fire safety systems.

                    We are able to provide the annual inspection and testing service for all buildings and facilities, such as  an engineered timber building, a fully automated mechanized car park, that require to obtain FC.


                    We are currently provide the FC inspection and tastings service for Marina Bay Sands, that include the hotel towers, exhibition centers, shopping centers, museum, carparking, F&B and the casinos...


                </p>
            </section>
        </div>
    );
};

export default AnnualFireCertification;

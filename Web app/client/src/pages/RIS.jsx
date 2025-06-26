import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RegisteredInspectorServices = () => {
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

            <section>
                <h2 className="text-2xl font-semibold mt-6 mb-3">Selected Projects</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>MRT Thomson Line</li>
                    <li>Marina Bay Sands</li>
                    <li>Sport Hub</li>
                    <li>Outram Community Hospital</li>
                    <li>Paya Lebar Quarter</li>
                    <li>Changi Airport Terminal 1</li>
                    <li>Mandai Zoo/Bird Park</li>
                </ul>
            </section>
        </div>
    );
};

export default RegisteredInspectorServices;

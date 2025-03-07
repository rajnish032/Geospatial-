import React from "react";
import Image from "next/image";

const Hero = () => {
  const features = [
    {
      title: "Experienced and Professional Team",
      description:
        "Our team of highly experienced engineers working around the clock to provide you with the best service.",
      image: "/thejashari_KmtIitd5as.png",
    },
    {
      title: "Tailor-made Solutions",
      description:
        "Our solutions have adaptability to a wide range of applications with user-specific customization ensuring optimal performance to meet customers' needs.",
      image: "/thejashari_KmtIitd5as.png",
    },
    {
      title: "5X Faster Data Delivery",
      description:
        "We have automated the workflow to process and analyze the data collected to deliver on or before time.",
      image: "/thejashari_KmtIitd5as.png",
    },
    {
      title: "Asset Management Platform",
      description:
        "Store collected data, processed data in a cloud on our platform which can be easily accessible to the clients to manage and collaborate. The platform will also provide real-time updates of the assets or projects.",
      image: "/thejashari_KmtIitd5as.png",
    },
  ];

  return (
    <div className="bg-black text-white py-16 px-6 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        How we are Different?
      </h2>
      <div className="relative flex flex-col items-center">
        {/* Timeline Line */}
        <div className="absolute w-1 bg-gray-600 h-full left-1/2 transform -translate-x-1/2"></div>

        {features.map((feature, index) => (
          <div
            key={index}
            className={`relative flex items-center w-full md:w-3/4 lg:w-1/2 mb-10 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {/* Image Side */}
            <div className="w-1/2 flex justify-center px-8">
              <Image
                src={feature.image}
                alt={feature.title}
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>

            {/* Text Side with Margin from the Line */}
            <div
              className={`bg-gray-800 p-6 rounded-lg w-80 transition-transform transform hover:scale-105 hover:bg-blue-600 ${
                index % 2 === 0 ? "ml-10" : "mr-10"
              }`}
            >
              <h3 className="text-lg font-semibold text-blue-400">
                {feature.title}
              </h3>
              <p className="text-gray-300 mt-2">{feature.description}</p>
            </div>

            {/* Timeline Dots */}
            <div className="absolute w-4 h-4 bg-white rounded-full left-1/2 transform -translate-x-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;



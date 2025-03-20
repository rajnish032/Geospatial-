
import FAQ from "@/components/faq";
import FeatureSection from "@/components/featureSection";
import { Feedback } from "@/components/feedback";
// import Header, { ImagesSliderDemo } from "@/components/header";
import Hero from "@/components/hero";


import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

import Register from "@/components/header";




const featuresData = [
  {
    id: 1,
    title: "🚀 Work on Cutting-Edge Projects",
    description:
      "Gain access to real-world geospatial datasets and process drone imagery, LiDAR, and GIS data.",
    image: "/landingpage/assests/istockphoto-1337105633-612x612.jpg",
    alt: "Capture image",
    
  },
  {
    id: 2,
    title: "💰 Earn Recognition & Rewards",
    description:
      "Get certified, build your reputation, and unlock high-paying opportunities.",
    image: "/landingpage/assests/download (1).jpeg",
    alt: "Industry Insights",
  },
  {
    id: 3,
    title: "🌍 Be Part of an Exclusive Community",
    description:
      "Connect with top geospatial experts and collaborate on global projects.",
    image: "/landingpage/assests/hannah-busing-Zyx1bK9mqmA-unsplash.jpg",
    alt: "Smart Cities",
    
  },
  {
    id: 4,
    title: "📈 Advance Your Career",
    description:
      "Create a verified portfolio, gain exposure, and establish credibility in the industry.",
    image: "/landingpage/assests/360_F_444393374_40Fs9t5kUMHVQBx6mXpTY8eRAGo6og97.jpg",
    alt: "Smart Cities",
    
  },
];

export default function Home() {
  return (
    <main>
      
      <Navbar/>
      <Register />
      {/* <ImagesSliderDemo/> */}
     
      <FeatureSection features={featuresData} />
      
      <Hero/>

      <FAQ />
      <Feedback />
      <Footer />

    </main>
  );
}


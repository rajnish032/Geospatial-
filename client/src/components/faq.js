import Accordion from "./Accordion";

const FAQ = () => {
  return (
    <div className="p-6 bg-black text-white w-full min-h-screen flex flex-col justify-center">
      <h3 className="text-5xl md:text-6xl font-bold text-blue-400 text-center">FAQ&apos;s</h3>

      <div className="max-w-4xl mx-auto w-full">
        {faqData.map((faq, index) => (
          <div key={index}>
            <Accordion title={faq.title} answer={faq.answer} />
            <div className="bg-blue-500 h-[1px] w-full mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const faqData = [
  { title: "Can I Register if I don't have Drones?", answer: "Yes, you are welcome. All we want is relevant Pilot skills." },
  { title: "Can I Register if I don't have a Pilot License?", answer: "Yes, you are welcome, you will be eligible to receive jobs." },
  { title: "Do I have to relocate?", answer: "No, You can work from anywhere, we will provide you job which matches your service range and chosen areas." },
  { title: "What are the service areas used for?", answer: "Service areas inform us where you prefer to fly your missions. This does not prevent you from receiving missions outside of this area. Our Pilot Success team may send you missions regardless of the service area you provide." },
  { title: "Who owns the data that you collect?", answer: "Aero2Astro owns all data collected using our technology unless otherwise specified by the client." },
  { title: "What is your average turnaround time?", answer: "Projects are typically ready within 2-5 business days with an ASAP mindset." },
  { title: "How will I access my data?", answer: "Data is accessed through our proprietary portal or a viewable link to online deliverables. We can also use API tools to access existing systems for ease of delivery." },
  { title: "Do you service my area?", answer: "If you are within INDIA, absolutely! All inquiries originating outside INDIA will be considered on an individual basis." },
  { title: "What packages do you offer for my industry?", answer: "Aero2Astro does have set packages as per Industry Market standards. For more details, you can contact us at +91 6006535445." },
  { title: "What happens if I do not complete the registration process?", answer: "You will not be able to accept or reject a mission for which you may be eligible. You can complete the registration process by clicking the Finish Setup button or Registering through the form." },
  { title: "How do I change my password?", answer: "You can change your password on the login page using the Forgot Password option." },
  { title: "How do I update my profile?", answer: "You can change your profile before applying on the dashboard, profile page." }
];

export default FAQ;




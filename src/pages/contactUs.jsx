import React from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

const ContactUs = () => {


  const director = [
    { 
      name: "Vineet Hans",
      role: "Director",
      phone: "99503 64747",
      email: "director@example.com",
      img: "https://via.placeholder.com/300" // replace with real image link
    }
  ];

  const hod = [
    {
      name: "Vinay Hans",
      role: "Head of Department",
      phone: "90248 84949",
      email: "hod@example.com",
      img: "https://via.placeholder.com/300"
    }
  ];

  const faculty = [
    {name: "Aakash Gupta",
    role: "Mathematics Faculty",
    phone: "9999999999",
    email: "faculty@example.com",
    img: "https://via.placeholder.com/300"},

    {name: "Mustaq",
    role: "Chemistry Faculty",
    phone: "9999999999",
    email: "faculty@example.com",
    img: "https://via.placeholder.com/300"},

    {name: "Sandeep Sharma",
    role: "Physics Faculty",
    phone: "9999999999",
    email: "faculty@example.com",
    img: "https://via.placeholder.com/300"},

    {name: "Aakash Gupta",
    role: "Mathematics Faculty",
    phone: "9999999999",
    email: "faculty@example.com",
    img: "https://via.placeholder.com/300"},

    {name: "Aakash Gupta",
    role: "Mathematics Faculty",
    phone: "9999999999",
    email: "faculty@example.com",
    img: "https://via.placeholder.com/300"},


  ];

  const staff = [
    {
    name: "Mahinder",
    role: "Management",
    phone: "8888888888",
    email: "support@example.com",
    img: "https://via.placeholder.com/300"
  },
  {
    name: "Isha Soni",
    role: "Management",
    phone: "8888888888",
    email: "support@example.com",
    img: "https://via.placeholder.com/300"
  },

];

  const tech = [
    {
    name: "Hardik Dhoot",
    role: "Webisite Development Head",
    phone: "63789 49658",
    email: "tech@example.com",
    img: "https://via.placeholder.com/300"
    },

    {
    name: "Garvit Mathur",
    role: "Website Development Member",
    phone: "90792 12029",
    email: "tech@example.com",
    img: "https://via.placeholder.com/300"
    },

    {
    name: "Utkarsh Mathur",
    role: "Website Development Member",
    phone: "86962 44108",
    email: "tech@example.com",
    img: "https://via.placeholder.com/300"
    },

    {
    name: "Prakshit Mathur",
    role: "Website Development Member",
    phone: "98295 91055",
    email: "tech@example.com",
    img: "https://via.placeholder.com/300"
    },
];

  
  const Card = ({ name, role, phone, email, img }) => (
    <div className="bg-[#2A2F36] rounded-xl p-6 w-full sm:w-[260px] shadow-md hover:shadow-blue-500/20 border border-gray-700 hover:-translate-y-2 transition-all duration-300">
      <img
        src={img}
        alt={name}
        className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-[#3BBAF4]"
      />
      <h3 className="text-center text-xl font-semibold mt-5">{name}</h3>
      <p className="text-center text-gray-300 text-sm">{role}</p>

      <div className="mt-4 space-y-1 text-sm">
        <p className="text-[#3abbf5] flex items-center gap-2 hover:underline cursor-pointer">
          <FaPhoneAlt size={18} />{phone}
        </p>
        <p className="text-[#42BA96] flex items-center gap-2 hover:underline cursor-pointer">
          <IoMdMail size={18}/> {email}
        </p>
      </div>
    </div>
  );

  return (
    <>
    <Navbar />
    <div className="min-h-screen  text-white py-16 px-6">
      
      <h1 className="text-center text-5xl font-bold mb-25">
        Contact Us
      </h1>

      {/* ===== Director + HOD (Same Level) ===== */}
      <section className="mb-16 text-center">
        <h2 className="text-3xl font-semibold mb-10 text-center w-full">Leadership Team</h2>

        <div className="flex flex-wrap gap-6 justify-center">
          {director.map((d, i) => <Card key={`director-${i}`} {...d} />)}
          {hod.map((h, i) => <Card key={`hod-${i}`} {...h} />)}
        </div>
      </section>


      {/* ===== Faculty Members ===== */}
      <Section title="Faculty Members" data={faculty} Card={Card} />

      {/* ===== Support Staff ===== */}
      <Section title="Support Staff" data={staff} Card={Card} />

      {/* ===== Tech Team ===== */}
      <Section title="Tech Team" data={tech} Card={Card} />

    </div>
    <Footer />
  </>
  );
};


// Reusable Section Component
const Section = ({ title, data, Card }) => (
  <section className="mb-16 text-center">
    <h2 className="text-3xl font-semibold mb-10 border-l-4 pl-3 border-blue-500 inline-block text-left">
      {title}
    </h2>

    <div className="flex flex-wrap gap-6 justify-center">   {/* CENTERED */}
      {data.map((person, index) => (
        <Card key={index} {...person} />
      ))}
    </div>
  </section>
  );



export default ContactUs;

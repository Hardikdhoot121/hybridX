import React from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import AdminNavbar from "../admin/pages/AdminNavbar";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

// images 
import img3 from "../images/Hardik.jpeg";
import img4 from "../images/Garvit.jpeg";
import img5 from "../images/Utkarsh.webp";
import img6 from "../images/Paksa.jpeg";
import img1 from "../images/VineetSir.jpeg";
import img2 from "../images/VinaySir.jpeg";

const ContactUs = () => {


  const director = [
    {
      name: "Vineet Hans",
      role: "Director",
      phone: "99503 64747",
      email: "hybrideduhub@gmail.com",
      img: img1
    }
  ];

  const hod = [
    {
      name: "Vinay Hans",
      role: "Head of Department",
      phone: "90248 84949",
      email: "hybrideduhub@gmail.com",
      img: img2
    }
  ];

  const tech = [
    {
      name: "Hardik Dhoot",
      role: "Website Development Head",
      phone: "63789 49658",
      email: "hardikdhoot121@gmail.com",
      img: img3
    },

    {
      name: "Garvit Mathur",
      role: "Website Development Member",
      phone: "90792 12029",
      email: "mathurgarvti@gmail.com",
      img: img4
    },

    {
      name: "Utkarsh Mathur",
      role: "Website Development Member",
      phone: "86962 44108",
      email: "tech@example.com",
      img: img5
    },

    {
      name: "Prakshit Mathur",
      role: "Website Development Member",
      phone: "98295 91055",
      email: "tech@example.com",
      img: img6
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
          <IoMdMail size={18} /> {email}
        </p>
      </div>
    </div>
  );

  // Check if user is admin
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  return (
    <>
      {/* Conditionally render navbar based on user role */}
      {isAdmin ? <AdminNavbar /> : <Navbar />}
      <div className="min-h-screen  text-white py-16 px-6">

        <h1 className="text-center text-5xl font-bold mb-25">
          Contact Us
        </h1>

        {/* ===== Director + HOD (Same Level) ===== */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-10 text-center w-full">Leadership Team</h2>

          <div className="flex flex-wrap gap-6 justify-center " id="leaders" >
           
              {director.map((d, i) => <Card key={`director-${i}`} {...d} />)}
              {hod.map((h, i) => <Card key={`hod-${i}`} {...h} />)}
          </div>
  
        </section>




        {/* ===== Tech Team ===== */}
        <div id="techteam">
          <Section title="Dev Team" data={tech} Card={Card} />
        </div>

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

import React from "react";

export default function Footer() {
  return (
    <footer className="body-font mt-10 bg-white text-gray-600">
      <div className="container mx-auto flex flex-col flex-wrap px-5 py-12 md:flex-row md:flex-nowrap md:items-start lg:items-start">
        
        {}
        <div className="mx-auto w-64 shrink-0 text-center md:mx-0 md:text-left">
          <a className="title-font flex items-center justify-center font-medium text-gray-900 md:justify-start">
            <img 
              src="../src/images/hybrid_logo.jpg" 
              className="w-10 rounded" 
              alt="Hybrid Logo" 
            />
            <span className="ml-3 text-xl">Hybrid Education Hub</span>
          </a>

          <nav className="mt-4 mb-8 list-none">
            <li className="mb-2 flex items-center justify-center md:justify-start">
              <img src="/images/Mail.png" className="mr-3 h-4" alt="mail icon" />
              <a href="mailto:hybrideducationhub@email.com" className="hover:text-gray-800">
                hybrideducationhub@email.com
              </a>
            </li>
            <li className="mb-2 flex items-center justify-center md:justify-start">
              <img src="/images/Phone.png" className="mr-3 h-4" alt="phone icon" />
              <a href="tel:+919451248755" className="hover:text-gray-800">
                +91 9451248755
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <img src="/images/Location.png" className="mr-3 h-4" alt="location icon" />
              <span className="text-sm">
                A-58, Shri Ram Nagar, Jodhpur, Rajasthan 342014
              </span>
            </li>
          </nav>
        </div>

        {}
        <div className="mt-10 flex grow flex-wrap text-center md:mt-0 md:pl-20 md:text-left">
          
          {}
          <div className="w-full px-4 md:w-1/3">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest uppercase text-gray-900">
              Home
            </h2>
            <nav className="mb-6 list-none space-y-2">
              <li><a href="#benefits" className="hover:text-gray-800">Benefits</a></li>
              <li><a href="#test-series" className="hover:text-gray-800">Our Test Series</a></li>
              <li><a href="#educators" className="hover:text-gray-800">Our Educators</a></li>
              <li><a href="#faqs" className="hover:text-gray-800">Our FAQs</a></li>
            </nav>
          </div>

          {}
          <div className="w-full px-4 md:w-1/3">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest uppercase text-gray-900">
              About Us
            </h2>
            <nav className="mb-6 list-none space-y-2">
              <li><a href="#company" className="hover:text-gray-800">Company</a></li>
              <li><a href="#achievements" className="hover:text-gray-800">Achievements</a></li>
              <li><a href="#goals" className="hover:text-gray-800">Our Goals</a></li>
            </nav>
          </div>

          {}
          <div className="w-full px-4 md:w-1/3">
            <h2 className="title-font mb-3 text-sm font-medium tracking-widest uppercase text-gray-900">
              Follow Us
            </h2>
            <nav className="flex list-none justify-center space-x-5 md:justify-start">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#1DA1F2]">
                  <svg fill="currentColor" className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#E4405F]">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                    <path d="M17.5 6.5h.01"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#0A66C2]">
                  <svg fill="currentColor" className="h-5 w-5" viewBox="0 0 24 24">
                    <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                    <circle cx="4" cy="4" r="2" stroke="none"></circle>
                  </svg>
                </a>
              </li>
            </nav>
          </div>
        </div>
      </div>

      {}
      <div className="bg-gray-100 py-4">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hybrid Education Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
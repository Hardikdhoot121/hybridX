import React from "react";

export default function Footer() {
  return (
    <>
<footer class="body-font bg-white text-gray-600 mt-10">
  <div class="flex items-center justify-center">
    <div class="container mx-auto flex flex-col flex-wrap px-5 py-12 md:flex-row md:flex-nowrap md:items-start lg:items-start">
      
      
      <div class="mx-auto w-64 shrink-0 text-center md:mx-0 md:text-left">
        <a class="title-font flex items-center justify-center font-medium text-gray-900 md:justify-start">
          <img src="../src/images/hybrid_logo.jpg" class="w-10" alt="Hybrid Logo" />
          <span class="ml-3 text-xl">Hybrid Education Hub</span>
        </a>

        <nav class="mb-8 list-none mt-4">
          <li class="flex items-center mb-2">
            <img src="images/Mail.png" class="h-4 mr-3" alt="mail" />
            <a class="text-gray-600 hover:text-gray-800">hybrideducationhub@email.com</a>
          </li>
          <li class="flex items-center mb-2">
            <img src="images/Phone.png" class="h-4 mr-3" alt="phone" />
            <a class="text-gray-600 hover:text-gray-800">+91 9451248755</a>
          </li>
          <li class="flex items-center">
            <img src="images/Location.png" class="h-4 mr-3" alt="location" />
            <a class="text-gray-600 hover:text-gray-800">A-58, Shri Ram Nagar, Jodhpur, Rajasthan 342014</a>
          </li>
        </nav>
      </div>

      
      <div class="mt-10 flex grow flex-wrap text-center md:mt-0 md:pl-20 md:text-left">
        
        <div class="w-full px-4 md:w-1/3">
          <h2 class="title-font mb-3 text-sm font-medium tracking-widest text-gray-900">Home</h2>
          <nav class="mb-6 list-none">
            <li><a class="text-gray-600 hover:text-gray-800">Benefits</a></li>
            <li><a class="text-gray-600 hover:text-gray-800">Our Test Series</a></li>
            <li><a class="text-gray-600 hover:text-gray-800">Our Educators</a></li>
            <li><a class="text-gray-600 hover:text-gray-800">Our FAQs</a></li>
          </nav>
        </div>

        
        <div class="w-full px-4 md:w-1/3">
          <h2 class="title-font mb-3 text-sm font-medium tracking-widest text-gray-900">About Us</h2>
          <nav class="mb-6 list-none">
            <li><a class="text-gray-600 hover:text-gray-800">Company</a></li>
            <li><a class="text-gray-600 hover:text-gray-800">Achievements</a></li>
            <li><a class="text-gray-600 hover:text-gray-800">Our Goals</a></li>
          </nav>
        </div>

        
        <div class="w-full px-4 md:w-1/3">
          <h2 class="title-font mb-3 text-sm font-medium tracking-widest text-gray-900">Social Media</h2>
          <nav class="flex list-none justify-center md:justify-start space-x-5">
            
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-800">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  class="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 
                    10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 
                    5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 
                    7.72 0 0023 3z"></path>
                </svg>
              </a>
            </li>
            
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-800">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2" class="h-5 w-5" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                  <path d="M17.5 6.5h.01"></path>
                </svg>
              </a>
            </li>
            
            <li>
              <a href="#" class="text-gray-600 hover:text-gray-800">
                <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="0" class="h-5 w-5" viewBox="0 0 24 24">
                  <path stroke="none"
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 
                    2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 
                    6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2" stroke="none"></circle>
                </svg>
              </a>
            </li>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-100 py-3">
    <p class="text-center text-sm text-gray-500">© 2022 Hybrid. All rights reserved.</p>
  </div>
</footer>
</>
  );
}
import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { useEffect } from "react";

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-10">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Hybrid Education Hub, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, you should not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>
                Hybrid Education Hub provides users with access to educational resources, previous year questions (PYQs), mock tests, and a dedicated student dashboard. We reserve the right to modify or discontinue any part of the service with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Conduct and Account</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree that the information you provide during registration or profile completion is accurate and current.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Intellectual Property</h2>
              <p>
                All content, trademarks, logos, and materials provided on the platform are the property of Hybrid Education Hub. You may not distribute, modify, or reproduce any materials without written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Disclaimer of Warranties</h2>
              <p>
                Our services and educational materials are provided "as is" and "as available". We make no warranties regarding the accuracy, completeness, or reliability of any content provided on this platform.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
              <p>
                Hybrid Education Hub shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.
              </p>
            </section>

            <div className="mt-8 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;

import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { useEffect } from "react";

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-10">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p>
                When you use Hybrid Education Hub, we collect information that you provide securely (such as your name, email address, phone number, and class details) to better serve your educational needs. When authenticating through third parties (like Google), we receive your basic profile data required to create your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p>
                The information we collect is strictly used to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide and maintain our educational services and dashboard.</li>
                <li>Analyze and track your practice and test data to improve your learning experience.</li>
                <li>Communicate with you regarding updates, support, or security alerts.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Security and Storage</h2>
              <p>
                We implement strict security measures to protect your personal data. All passwords are encrypted, and we use secure connections (HTTPS) to prevent unauthorized access. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
              <p>
                Our platform utilizes secure third-party services (like Google OAuth) for authentication. Your interactions with these providers are governed by their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
              <p>
                You have the right to access, update, or request the deletion of your personal information from our servers at any time. Please contact our support team for assistance.
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

export default PrivacyPolicy;

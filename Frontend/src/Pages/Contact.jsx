import React from "react";

const Contact = () => {
  return (
    <div className="bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact Us
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          We'd love to hear from you. Get in touch with Ashishit Clothing.
        </p>
      </div>

      {/* Main Section */}
      <div className="px-6 md:px-16 lg:px-24 py-12 grid md:grid-cols-2 gap-10">

        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <h3 className="font-semibold mb-2">📍 Address</h3>
            <p className="text-gray-600">
              Pokhara, Nepal
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <h3 className="font-semibold mb-2">📞 Phone</h3>
            <p className="text-gray-600">
              +977-9800000000
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <h3 className="font-semibold mb-2">📧 Email</h3>
            <p className="text-gray-600">
              ashishitclothing@gmail.com
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <h3 className="font-semibold mb-2">⏰ Working Hours</h3>
            <p className="text-gray-600">
              Sun - Fri: 9AM - 7PM
            </p>
          </div>

        </div>

      </div>

      {/* Map Section */}
      <div className="px-6 md:px-16 lg:px-24 pb-12">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=Pokhara%20Nepal&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-72 border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

    </div>
  );
};

export default Contact;
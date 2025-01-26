import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Calendar, CreditCard, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Book Your Next Flight in India
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing destinations across India and book your flights with ease. 
          Your journey begins here.
        </p>
        <Link
          to="/search"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Search Flights
        </Link>
      </section>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <Calendar className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
          <p className="text-gray-600">Change your travel dates with no hassle</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <CreditCard className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
          <p className="text-gray-600">Your transactions are always protected</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <Clock className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
          <p className="text-gray-600">We're here to help anytime you need us</p>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Popular Routes
            </h2>
            <p className="text-gray-600">
              Explore our most booked routes across India
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Mumbai → Delhi</span>
                <span className="text-blue-600 font-semibold">from ₹4,999</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Bangalore → Mumbai</span>
                <span className="text-blue-600 font-semibold">from ₹3,999</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Delhi → Chennai</span>
                <span className="text-blue-600 font-semibold">from ₹5,499</span>
              </div>
            </div>
          </div>
          <div className="relative h-full min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80"
              alt="Indian cityscape with airplane"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
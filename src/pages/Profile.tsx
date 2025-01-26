import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Plane, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Modal from 'react-modal';
import type { Flight } from '../lib/types';

interface Booking {
  id: string;
  flight: Flight;
  seat_number: string;
  booking_status: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('*, flight:flights(*)')
          .eq('user_id', user.id);

        if (error) throw error;

        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const openModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalIsOpen(false);
  };

  // const removeBooking = async (bookingId: string) => {
  //   try {
  //     const { error } = await supabase
  //       .from('bookings')
  //       .delete()
  //       .eq('id', bookingId);

  //     if (error) throw error;

  //     setBookings(bookings.filter((booking) => booking.id !== bookingId));
  //   } catch (err) {
  //     console.error('Error removing booking:', err);
  //     setError('Failed to remove booking. Please try again.');
  //   }
  // };


  const removeBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
  
      if (error) throw error;
  
      // If the booking is successfully deleted from the database, remove it from the local state
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
    } catch (err) {
      console.error('Error removing booking:', err);
      setError('Failed to remove booking. Please try again.');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Update Profile
              </button>
            </form>
          </div>

          {/* Upcoming Flights */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Upcoming Flights</h2>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {booking.flight.departure_city} → {booking.flight.arrival_city}
                        </h3>
                        <p className="text-gray-600">
                          {new Date(booking.flight.departure_time).toLocaleDateString()} • Flight {booking.flight.flight_number}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => openModal(booking)}
                        >
                          View Details
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeBooking(booking.id)}
                        >
                          Remove Booking
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Payment Methods</h2>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">•••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/24</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Remove
                  </button>
                </div>
              </div>
              <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Details Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Flight Details"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedBooking && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Flight Details</h2>
            <p><strong>Flight Number:</strong> {selectedBooking.flight.flight_number}</p>
            <p><strong>Departure City:</strong> {selectedBooking.flight.departure_city}</p>
            <p><strong>Arrival City:</strong> {selectedBooking.flight.arrival_city}</p>
            <p><strong>Departure Time:</strong> {new Date(selectedBooking.flight.departure_time).toLocaleString()}</p>
            <p><strong>Seat Number:</strong> {selectedBooking.seat_number}</p>
            <p><strong>Booking Status:</strong> {selectedBooking.booking_status}</p>
            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
/*
  # Initial Schema for Flight Booking System

  1. New Tables
    - `users_profile`
      - Extended user profile information
      - Linked to auth.users
    - `flights`
      - Flight information including routes, times, prices
    - `bookings`
      - User flight bookings
    - `seats`
      - Available seats for each flight
    
  2. Security
    - RLS enabled on all tables
    - Policies for user data access
    - Public read access for flights
*/

-- Create users profile table
CREATE TABLE users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  phone_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flights table
CREATE TABLE flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number text NOT NULL,
  departure_city text NOT NULL,
  arrival_city text NOT NULL,
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  price decimal NOT NULL,
  available_seats integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  flight_id uuid REFERENCES flights(id),
  seat_number text NOT NULL,
  booking_status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create seats table
CREATE TABLE seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id uuid REFERENCES flights(id),
  seat_number text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(flight_id, seat_number)
);

-- Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public can view flights"
  ON flights FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view available seats"
  ON seats FOR SELECT
  TO anon, authenticated
  USING (true);
'use client'
import Image from 'next/image';
import { useState } from 'react';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: 'Mehrab',
    lastName: 'Bozorgi',
    profession: 'Doctor',
    working: 'SK hospital',
    achievements: 'Hero of the year',
    city: '',
    state: 'Bozorgi',
    about: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <button className="text-purple-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <Image
            src="/path/to/your/profile-pic.jpg"
            alt="Profile Picture"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <form className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="Last Name"
            />
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="Profession"
            />
            <input
              type="checkbox"
              className="h-5 w-5 text-purple-600"
              checked
              readOnly
            />
          </div>
          <input
            type="text"
            name="working"
            value={formData.working}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Working"
          />
          <input
            type="text"
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Achievements"
          />
          <div className="flex space-x-4">
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
            >
              <option value="">City</option>
              {/* Add city options here */}
            </select>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
            >
              <option value="Bozorgi">Bozorgi</option>
              {/* Add state options here */}
            </select>
          </div>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="About"
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

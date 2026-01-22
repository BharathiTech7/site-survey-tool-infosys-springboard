import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");

  // 🔒 ADD THIS (role check)
  const role = localStorage.getItem("role");
  const isSurveyor = role === "ROLE_SURVEYOR";

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    // 🔒 BLOCK SURVEYOR ACTION
    if (isSurveyor) return;

    const payload = { name, address, type };
    await api.post("/api/properties", payload);
    navigate("/properties");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Add Property
        </h1>
        <p className="text-sm text-gray-500">
          Create a new site for ISP survey and planning
        </p>

        {/* 🔒 MESSAGE FOR SURVEYOR */}
        {isSurveyor && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            Only admin can add properties
          </p>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <form onSubmit={submit} className="space-y-5">
          {/* Property Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name
            </label>
            <input
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Eg: RGMCET Campus"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={isSurveyor}   // 🔒
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="City, State, Country"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
              disabled={isSurveyor}   // 🔒
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={type}
              onChange={e => setType(e.target.value)}
              required
              disabled={isSurveyor}   // 🔒
            >
              <option value="">Select Type</option>
              <option value="University">University / Campus</option>
              <option value="Office">Office / Commercial</option>
              <option value="Hospital">Hospital</option>
              <option value="Residential">Residential (MDU)</option>
              <option value="Public">Public Area</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/properties/new")}
              className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSurveyor}   // 🔒
              className={`px-5 py-2 text-sm rounded-md ${
                isSurveyor
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;

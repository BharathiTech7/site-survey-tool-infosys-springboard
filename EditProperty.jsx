import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPropertyById,
  updateProperty,
} from "../services/propertyService";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState({
    name: "",
    address: "",
    type: "",
  });

  // 🔒 ROLE CHECK (NO CONFUSION)
  const role = localStorage.getItem("role");
  const isSurveyor = role === "ROLE_SURVEYOR";

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    const res = await getPropertyById(id);
    setProperty(res.data);
  };

  const handleChange = (e) => {
    setProperty({
      ...property,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 BLOCK SURVEYOR
    if (isSurveyor) return;

    await updateProperty(id, property);
    navigate("/properties");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Edit Property
        </h1>
        <p className="text-sm text-gray-500">
          Update property details for site survey planning
        </p>

        {/* 🔒 MESSAGE */}
        {isSurveyor && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            Only admin can edit properties
          </p>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Property Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name
            </label>
            <input
              name="name"
              value={property.name}
              onChange={handleChange}
              placeholder="Eg: RGMCET Campus"
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              name="address"
              value={property.address}
              onChange={handleChange}
              placeholder="City, State, Country"
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              name="type"
              value={property.type}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              onClick={() => navigate("/properties")}
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
              Update Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;

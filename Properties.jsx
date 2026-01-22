import { useEffect, useState } from "react";
import { getProperties, deleteProperty } from "../services/propertyService";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [deleteId, setDeleteId] = useState(null); // 🔴 modal control
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  // 🔒 ROLE CHECK
const role = localStorage.getItem("role");
const isSurveyor = role === "ROLE_SURVEYOR";


  const loadProperties = async () => {
    try {
      const res = await getProperties();
      setProperties(res.data);
    } catch (err) {
      console.error("Error loading properties", err);
    }
  };

  
  // ✅ CONFIRM DELETE
const confirmDelete = async () => {
  if (isSurveyor) return; // 🔒 BLOCK SURVEYOR

  await deleteProperty(deleteId);
  setDeleteId(null);
  loadProperties();
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Properties
          </h1>
          <p className="text-sm text-gray-500">
            Manage ISP survey properties and locations
          </p>
          {isSurveyor && (
  <p className="mt-2 text-sm text-red-600 font-medium">
    Only admin can Edit & delete properties
  </p>
)}

        </div>
<button
  onClick={() => navigate("/properties/new")}
  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
>
  ➕ Add Property
</button>


      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {properties.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No properties found
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{p.id}</td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {p.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {p.address}
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {p.type}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/properties/edit/${p.id}`)
                      }
                      className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                       Edit
                    </button>

                   <button
  onClick={() => !isSurveyor && setDeleteId(p.id)} // 🔒
  disabled={isSurveyor}
  className={`px-3 py-1 text-sm rounded ${
    isSurveyor
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-red-100 text-red-700 hover:bg-red-200"
  }`}
>
   Delete
</button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔴 DELETE MODAL */}
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Property"
        message="This property and all related buildings, floors, spaces, and surveys will be permanently deleted."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Properties;

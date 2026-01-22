import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import {
  getBuildingsByProperty,
  createBuilding,
  updateBuilding,
  deleteBuilding
} from "../services/buildingService";

const Buildings = () => {
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    floorsCount: ""
  });

  const [editingId, setEditingId] = useState(null);

  // 🔒 ROLE CHECK
  const role = localStorage.getItem("role");
  const isSurveyor = role === "ROLE_SURVEYOR";

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const res = await getProperties();
    setProperties(res.data);
  };

  const loadBuildings = async (pid) => {
    const res = await getBuildingsByProperty(pid);
    setBuildings(res.data);
  };

  const handleCreate = async () => {
    if (isSurveyor) return; // 🔒
    await createBuilding(propertyId, {
      ...form,
      floorsCount: Number(form.floorsCount)
    });
    resetForm();
    loadBuildings(propertyId);
  };

  const handleEdit = (building) => {
    if (isSurveyor) return; // 🔒
    setEditingId(building.id);
    setForm({
      name: building.name,
      code: building.code,
      floorsCount: building.floorsCount
    });
  };

  const handleUpdate = async () => {
    if (isSurveyor) return; // 🔒
    await updateBuilding(editingId, {
      ...form,
      floorsCount: Number(form.floorsCount)
    });
    resetForm();
    loadBuildings(propertyId);
  };

  const handleDeleteConfirm = async () => {
    if (isSurveyor) return; // 🔒
    await deleteBuilding(deleteId);
    setDeleteId(null);
    loadBuildings(propertyId);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", code: "", floorsCount: "" });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Buildings</h1>
        <p className="text-sm text-gray-500">
          Manage buildings inside selected property
        </p>

        {/* 🔒 MESSAGE */}
        {isSurveyor && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            Only admin can manage buildings
          </p>
        )}
      </div>

      {/* Property Selector */}
      <div className="bg-white border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Property
        </label>
        <select
          value={propertyId}
          onChange={(e) => {
            setPropertyId(e.target.value);
            loadBuildings(e.target.value);
          }}
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {propertyId && (
        <>
          {/* Add / Edit Building */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Building" : "Add Building"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                placeholder="Building Name"
                value={form.name}
                disabled={isSurveyor}   // 🔒
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <input
                placeholder="Code"
                value={form.code}
                disabled={isSurveyor}   // 🔒
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <input
                placeholder="Floors Count"
                type="number"
                value={form.floorsCount}
                disabled={isSurveyor}   // 🔒
                onChange={(e) =>
                  setForm({ ...form, floorsCount: e.target.value })
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={editingId ? handleUpdate : handleCreate}
                disabled={isSurveyor}   // 🔒
                className={`px-5 py-2 rounded-md ${
                  isSurveyor
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {editingId ? "Update Building" : "Add Building"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Buildings List */}
          <div className="bg-white border rounded-xl shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left text-sm">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Floors</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buildings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 p-6">
                      No buildings found
                    </td>
                  </tr>
                )}

                {buildings.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3">{b.code}</td>
                    <td className="p-3">{b.floorsCount}</td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => handleEdit(b)}
                        disabled={isSurveyor}   // 🔒
                        className={`text-sm ${
                          isSurveyor
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:underline"
                        }`}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => !isSurveyor && setDeleteId(b.id)}
                        disabled={isSurveyor}   // 🔒
                        className={`text-sm ${
                          isSurveyor
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:underline"
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Deletion
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              This building will be permanently deleted.
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buildings;

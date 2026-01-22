import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import { getBuildingsByProperty } from "../services/buildingService";
import { getFloorsByBuilding } from "../services/floorService";
import {
  createSpace,
  getSpacesByFloor,
  importSpacesCsv
} from "../services/spaceService";
import toast from "react-hot-toast";
import { deleteSpace } from "../services/spaceService";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
const Spaces = () => {
  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [spaces, setSpaces] = useState([]);
const [deleteSpaceId, setDeleteSpaceId] = useState(null);
  const [propertyId, setPropertyId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [floorId, setFloorId] = useState("");

  const [form, setForm] = useState({
    spaceName: "",
    spaceType: ""
  });

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
    setFloors([]);
    setSpaces([]);
  };

  const loadFloors = async (bid) => {
    const res = await getFloorsByBuilding(bid);
    setFloors(res.data);
    setSpaces([]);
  };

  const loadSpaces = async (fid) => {
    const res = await getSpacesByFloor(fid);
    setSpaces(res.data);
  };

  const handleCreate = async () => {
    if (isSurveyor) return; // 🔒
    await createSpace(floorId, form);
    setForm({ spaceName: "", spaceType: "" });
    loadSpaces(floorId);
  };

  const handleCsvImport = async (file) => {
    if (!file || isSurveyor) return; // 🔒

    try {
      await importSpacesCsv(floorId, file);
      loadSpaces(floorId);
      toast.success("Spaces imported successfully");
    } catch (err) {
      toast.error("Failed to import CSV");
    }
  };

  const handleDeleteSpace = async () => {
  try {
    await deleteSpace(deleteSpaceId);
    setSpaces(spaces.filter(s => s.id !== deleteSpaceId));
    setDeleteSpaceId(null);
    toast.success("Space deleted successfully");
  } catch (err) {
    toast.error("Failed to delete space");
  }
};



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Spaces
        </h1>
        <p className="text-sm text-gray-500">
          Manage rooms, labs, and survey spaces
        </p>

        {/* 🔒 MESSAGE */}
        {isSurveyor && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            Only admin can add or import spaces
          </p>
        )}
      </div>

      {/* Selection Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Property */}
        <select
          className="border border-slate-200
 rounded-md px-3 py-2"
          value={propertyId}
          onChange={(e) => {
            setPropertyId(e.target.value);
            loadBuildings(e.target.value);
          }}
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Building */}
        <select
          className="border border-slate-200
 rounded-md px-3 py-2"
          value={buildingId}
          disabled={!propertyId}
          onChange={(e) => {
            setBuildingId(e.target.value);
            loadFloors(e.target.value);
          }}
        >
          <option value="">Select Building</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Floor */}
        <select
          className="border border-slate-200
 rounded-md px-3 py-2"
          value={floorId}
          disabled={!buildingId}
          onChange={(e) => {
            setFloorId(e.target.value);
            loadSpaces(e.target.value);
          }}
        >
          <option value="">Select Floor</option>
          {floors.map((f) => (
            <option key={f.id} value={f.id}>
              {f.floorName}
            </option>
          ))}
        </select>
      </div>

      {/* Add Space */}
      {floorId && (
        <div className="bg-white border border-slate-200
 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            Add Space
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <input
              className="border border-slate-200
 rounded-md px-3 py-2"
              placeholder="Space Name"
              value={form.spaceName}
              disabled={isSurveyor} // 🔒
              onChange={(e) =>
                setForm({ ...form, spaceName: e.target.value })
              }
            />

            <input
              className="border border-slate-200
 rounded-md px-3 py-2"
              placeholder="Space Type (ROOM / LAB)"
              value={form.spaceType}
              disabled={isSurveyor} // 🔒
              onChange={(e) =>
                setForm({ ...form, spaceType: e.target.value })
              }
            />

            <button
              onClick={handleCreate}
              disabled={isSurveyor} // 🔒
              className={`rounded-md ${
                isSurveyor
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              ➕ Add Space
            </button>
          </div>
        </div>
      )}

      {/* CSV Import */}
      {floorId && (
        <div className="bg-white border border-slate-200
 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Import Spaces (CSV)
          </h3>

          <p className="text-sm text-gray-500">
            Upload a CSV file to bulk add spaces for this floor.
            <br />
            <span className="text-xs text-gray-400">
              Required columns: <b>spaceName</b>, <b>spaceType</b>
            </span>
          </p>

          <label
            className={`inline-flex items-center gap-2 px-4 py-2 border border-slate-200
 border-dashed rounded-md text-sm transition ${
              isSurveyor
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer text-blue-600 hover:bg-blue-50"
            }`}
          >
            📄 Upload CSV File
            <input
              type="file"
              accept=".csv"
              hidden
              disabled={isSurveyor} // 🔒
              onChange={(e) =>
                handleCsvImport(e.target.files[0])
              }
            />
          </label>
        </div>
      )}

      {/* Space List */}
{spaces.length > 0 && (
  <div className="bg-white border border-slate-200
rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Spaces
      </h3>
      <span className="text-sm text-gray-500">
        Total: {spaces.length}
      </span>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {spaces.map((s) => (
        <div
          key={s.id}
          className="group border border-slate-200
 rounded-xl p-5 bg-gray-50 hover:bg-white hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {s.spaceName}
              </h4>
            </div>

            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              {s.spaceType}
            </span>
          </div>

          <div className="mt-4 border border-slate-200
-t pt-3 text-xs text-gray-500">
            Ready for checklist & survey
          </div>

          {!isSurveyor && (
  <button
    onClick={() => setDeleteSpaceId(s.id)}
    className="mt-3 text-sm text-red-600 hover:underline"
  >
    Delete Space
  </button>
)}

        </div>
      ))}
    </div>
  </div>
)}


<DeleteConfirmModal
  open={!!deleteSpaceId}
  title="Delete Space"
  message="This space will be permanently deleted. This action cannot be undone."
  onCancel={() => setDeleteSpaceId(null)}
  onConfirm={handleDeleteSpace}
/>

    </div>
  );
};

export default Spaces;

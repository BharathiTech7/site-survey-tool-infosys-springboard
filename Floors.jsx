import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import { getBuildingsByProperty } from "../services/buildingService";
import {
  getFloorsByBuilding,
  createFloor,
  updateFloor,
  deleteFloor,
  uploadFloorPlan
} from "../services/floorService";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import toast from "react-hot-toast";

const Floors = () => {
  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [buildingId, setBuildingId] = useState("");

  const [form, setForm] = useState({
    floorName: "",
    floorNumber: ""
  });

  const [newFloorPlan, setNewFloorPlan] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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
    setBuildingId("");
    setFloors([]);
  };

  const loadFloors = async (bid) => {
    const res = await getFloorsByBuilding(bid);
    setFloors(res.data);
  };

  const handleUpdateFloor = async (floor) => {
    if (isSurveyor) return; // 🔒
    try {
      await updateFloor(floor.id, {
        floorName: floor.floorName,
        floorNumber: Number(floor.floorNumber),
      });
      await loadFloors(buildingId);
      toast.success("Changes saved successfully");
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const handleCreate = async () => {
    if (isSurveyor) return; // 🔒
    const res = await createFloor(buildingId, {
      ...form,
      floorNumber: Number(form.floorNumber)
    });

    if (newFloorPlan) {
      await uploadFloorPlan(res.data.id, newFloorPlan);
      setNewFloorPlan(null);
    }

    setForm({ floorName: "", floorNumber: "" });
    loadFloors(buildingId);
  };

  const confirmDelete = async () => {
    if (isSurveyor) return; // 🔒
    await deleteFloor(deleteId);
    setDeleteId(null);
    loadFloors(buildingId);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Floors Management
        </h1>
        <p className="text-sm text-gray-500">
          Create floors, update details, and upload floor plans
        </p>

        {/* 🔒 MESSAGE */}
        {isSurveyor && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            Only admin can manage floors
          </p>
        )}
      </div>

      {/* PROPERTY + BUILDING */}
      <div className="bg-white border rounded-xl p-6 grid sm:grid-cols-2 gap-4">
        <select
          className="border rounded-md px-3 py-2"
          value={propertyId}
          onChange={(e) => {
            setPropertyId(e.target.value);
            loadBuildings(e.target.value);
          }}
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          className="border rounded-md px-3 py-2"
          value={buildingId}
          disabled={!propertyId}
          onChange={(e) => {
            setBuildingId(e.target.value);
            loadFloors(e.target.value);
          }}
        >
          <option value="">Select Building</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* ADD FLOOR */}
      {buildingId && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Add New Floor</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <input
              className="border rounded-md px-3 py-2"
              placeholder="Floor Name"
              value={form.floorName}
              disabled={isSurveyor} // 🔒
              onChange={(e) =>
                setForm({ ...form, floorName: e.target.value })
              }
            />

            <input
              className="border rounded-md px-3 py-2"
              type="number"
              placeholder="Floor Number"
              value={form.floorNumber}
              disabled={isSurveyor} // 🔒
              onChange={(e) =>
                setForm({ ...form, floorNumber: e.target.value })
              }
            />

            <label className="border rounded-md px-3 py-2 cursor-pointer text-sm text-gray-600 hover:bg-gray-50">
              Upload Floor Plan
              <input
                type="file"
                hidden
                disabled={isSurveyor} // 🔒
                onChange={(e) =>
                  setNewFloorPlan(e.target.files[0])
                }
              />
            </label>
          </div>

          <button
            onClick={handleCreate}
            disabled={isSurveyor} // 🔒
            className={`px-4 py-2 rounded-md ${
              isSurveyor
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ➕ Add Floor
          </button>
        </div>
      )}

      {/* FLOOR LIST */}
      {floors.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Existing Floors</h3>

          <div className="space-y-3">
            {floors.map((f) => (
              <div
                key={f.id}
                className="border rounded-xl p-5 bg-gray-50 hover:bg-gray-100 transition flex flex-col gap-4"
              >
                <div className="grid sm:grid-cols-3 gap-4 items-end">
                  <input
                    className="border rounded-md px-3 py-2"
                    value={f.floorName}
                    disabled={isSurveyor} // 🔒
                    onChange={(e) =>
                      setFloors(
                        floors.map((fl) =>
                          fl.id === f.id
                            ? { ...fl, floorName: e.target.value }
                            : fl
                        )
                      )
                    }
                  />

                  <input
                    type="number"
                    className="border rounded-md px-3 py-2"
                    value={f.floorNumber}
                    disabled={isSurveyor} // 🔒
                    onChange={(e) =>
                      setFloors(
                        floors.map((fl) =>
                          fl.id === f.id
                            ? { ...fl, floorNumber: e.target.value }
                            : fl
                        )
                      )
                    }
                  />

                  <div>
                    <label className="text-xs text-gray-500">
                      Floor Plan (Image / PDF)
                    </label>

                    <label className="mt-1 inline-flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:underline">
                      📤 Upload or Replace Floor Plan
                      <input
                        type="file"
                        hidden
                        disabled={isSurveyor} // 🔒
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={(e) =>
                          uploadFloorPlan(f.id, e.target.files[0])
                        }
                      />
                    </label>

                    <p className="mt-1 text-xs text-gray-400">
                      Used for space mapping & survey reference
                    </p>

                    {f.floorPlanPath && (
                      <span className="mt-1 block text-xs text-green-600">
                        ✅ Floor plan uploaded
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <button
                    onClick={() => handleUpdateFloor(f)}
                    disabled={isSurveyor} // 🔒
                    className={`px-4 py-2 rounded-md text-sm ${
                      isSurveyor
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => !isSurveyor && setDeleteId(f.id)}
                    disabled={isSurveyor} // 🔒
                    className={`px-4 py-2 rounded-md text-sm ${
                      isSurveyor
                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    Delete Floor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Floor"
        message="This floor and its related spaces will be permanently deleted."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Floors;

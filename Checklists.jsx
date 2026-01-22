import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import { getBuildingsByProperty } from "../services/buildingService";
import { getFloorsByBuilding } from "../services/floorService";
import { getSpacesByFloor } from "../services/spaceService";
import {
  createChecklist,
  getChecklistsBySpace
} from "../services/checklistService";
import ChecklistQuestions from "./ChecklistQuestions";
import ChecklistResponses from "./ChecklistResponses";
import { isAdmin } from "../utils/role";

const Checklists = () => {
  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [checklists, setChecklists] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [floorId, setFloorId] = useState("");
  const [spaceId, setSpaceId] = useState("");
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  const [form, setForm] = useState({ name: "", description: "" });

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
    setChecklists([]);
    setSelectedChecklist(null);
  };

  const loadFloors = async (bid) => {
    const res = await getFloorsByBuilding(bid);
    setFloors(res.data);
    setSpaces([]);
    setChecklists([]);
    setSelectedChecklist(null);
  };

  const loadSpaces = async (fid) => {
    const res = await getSpacesByFloor(fid);
    setSpaces(res.data);
    setChecklists([]);
    setSelectedChecklist(null);
  };

  const loadChecklists = async (sid) => {
    const res = await getChecklistsBySpace(sid);
    setChecklists(res.data || []);
    setSelectedChecklist(null);
  };

  const handleCreateChecklist = async () => {
    await createChecklist(spaceId, form);
    setForm({ name: "", description: "" });
    loadChecklists(spaceId);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800">
        Checklist Templates
      </h2>

      {/* Hierarchy Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="input" value={propertyId} onChange={(e) => {
          setPropertyId(e.target.value);
          loadBuildings(e.target.value);
        }}>
          <option value="">Select Property</option>
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select className="input" value={buildingId} disabled={!propertyId}
          onChange={(e) => {
            setBuildingId(e.target.value);
            loadFloors(e.target.value);
          }}>
          <option value="">Select Building</option>
          {buildings.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select className="input" value={floorId} disabled={!buildingId}
          onChange={(e) => {
            setFloorId(e.target.value);
            loadSpaces(e.target.value);
          }}>
          <option value="">Select Floor</option>
          {floors.map(f => (
            <option key={f.id} value={f.id}>{f.floorName}</option>
          ))}
        </select>

        <select className="input" value={spaceId} disabled={!floorId}
          onChange={(e) => {
            setSpaceId(e.target.value);
            loadChecklists(e.target.value);
          }}>
          <option value="">Select Space</option>
          {spaces.map(s => (
            <option key={s.id} value={s.id}>{s.spaceName}</option>
          ))}
        </select>
      </div>

      {/* Create Checklist */}
      {spaceId && isAdmin() && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Create New Checklist
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Checklist Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button
            onClick={handleCreateChecklist}
            className="btn-primary"
          >
            + Create Checklist
          </button>
        </div>
      )}

      {/* Existing Checklists */}
      {checklists.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            Existing Checklists
          </h3>

          <ul className="space-y-2">
            {checklists.map(c => (
              <li
                key={c.id}
                onClick={() => setSelectedChecklist(c)}
                className={`p-3 rounded-lg cursor-pointer border
                  ${selectedChecklist?.id === c.id
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"}`}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-500">{c.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions + Responses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChecklistQuestions checklists={checklists} />
        {selectedChecklist && (
          <ChecklistResponses checklist={selectedChecklist} />
        )}
      </div>
    </div>
  );
};

export default Checklists;

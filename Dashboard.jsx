import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import { isAdmin } from "../utils/role";

import {
  ClipboardList,
  CheckCircle,
  Edit3,
  Percent
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const res = await getDashboardSummary();
    setSummary(res.data);
  };

  /* ================= ADMIN DATA ================= */
  const adminStats = [
    {
      title: "Total Responses",
      value: summary?.totalResponses ?? 0,
      icon: ClipboardList
    },
    {
      title: "Submitted",
      value: summary?.submitted ?? 0,
      icon: CheckCircle
    },
    {
      title: "Draft",
      value: summary?.draft ?? 0,
      icon: Edit3
    },
    {
      title: "Completion %",
      value: `${summary?.completionPercent?.toFixed(1) ?? 0}%`,
      icon: Percent
    }
  ];

  const chartData = [
    { name: "Submitted", value: summary?.submitted ?? 0 },
    { name: "Draft", value: summary?.draft ?? 0 }
  ];

  /* ================= USER VIEW ================= */
  const userStats = [
    {
      title: "Your Submitted",
      value: summary?.submitted ?? 0
    },
    {
      title: "Pending Drafts",
      value: summary?.draft ?? 0
    }
  ];

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          {isAdmin()
            ? "System-wide survey analytics"
            : "Your survey activity overview"}
        </p>
      </div>

      {/* ================= ADMIN DASHBOARD ================= */}
      {isAdmin() && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        {item.title}
                      </p>
                      <h2 className="text-3xl font-bold mt-1">
                        {item.value}
                      </h2>
                    </div>

                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-600 text-white">
                      <Icon size={26} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border rounded-2xl p-6">
              <h3 className="font-semibold mb-4">
                Responses Overview
              </h3>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border rounded-2xl p-6 flex flex-col items-center justify-center">
              <h3 className="font-semibold mb-3">
                Completion Rate
              </h3>

              <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center">
                <div className="text-3xl font-bold text-blue-700">
                  {summary?.completionPercent?.toFixed(1) ?? 0}%
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= USER DASHBOARD ================= */}
      {!isAdmin() && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {userStats.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-6 shadow-sm"
            >
              <p className="text-sm text-gray-500">
                {item.title}
              </p>
              <h2 className="text-3xl font-bold mt-1">
                {item.value}
              </h2>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-800">
              Next Action
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Complete pending checklist drafts to increase completion rate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

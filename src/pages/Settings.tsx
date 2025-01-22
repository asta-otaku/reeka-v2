import { useState, useEffect } from "react";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import ChangePassword from "../components/Settings/ChangePassword";
import EditInfo from "../components/Settings/EditInfo";
import PersonnelManagement from "../components/Settings/PersonnelManagement";

const tabs = [
  { name: "Password Reset", id: "change_password" },
  { name: "Edit Info", id: "edit_info" },
  { name: "Staff Management", id: "staff_management" },
  { name: "Agent Management", id: "agent_management" },
];

function Settings() {
  const [activeTab, setActiveTab] = useState("change_password");
  const [user, setUser] = useState<{ userRole?: string }>({});

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Settings"
          description="Manage your account settings."
        />
        <div className="mt-4 px-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 text-xs md:text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500"
                } ${
                  (tab.id === "staff_management" ||
                    tab.id === "agent_management") &&
                  user.userRole !== "Owner"
                    ? "hidden"
                    : "block"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "change_password" && <ChangePassword />}
            {activeTab === "edit_info" && <EditInfo />}
            {activeTab === "staff_management" && <PersonnelManagement />}
            {activeTab === "agent_management" && (
              <PersonnelManagement isAgent={true} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;

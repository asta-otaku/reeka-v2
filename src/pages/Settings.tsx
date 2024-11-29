import { useState } from "react";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import ChangePassword from "../components/Settings/ChangePassword";
import EditInfo from "../components/Settings/EditInfo";
import PersonnelManagement from "../components/Settings/PersonnelManagement";

const user = JSON.parse(sessionStorage.getItem("user") || "{}");

const tabs = [
  { name: "Password Reset", id: "change_password" },
  { name: "Edit Info", id: "edit_info" },
  { name: "Team Management", id: "team_management" },
];

function Settings() {
  const [activeTab, setActiveTab] = useState("change_password");

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
                  tab.id === "team_management" && user.userRole !== "Owner"
                    ? "hidden"
                    : ""
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
            {activeTab === "team_management" && <PersonnelManagement />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;

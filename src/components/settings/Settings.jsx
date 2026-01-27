import "./Settings.css";

import ProfileCard from "./cards/ProfileCard";
import WorkspaceCard from "./cards/WorkspaceCard";
import PreferencesCard from "./cards/PreferencesCard";
import DangerCard from "./cards/DangerCard";

export default function Settings() {
  return (
    <div className="settings">
      <h2 className="settings-title">Settings</h2>

      <ProfileCard />
      <WorkspaceCard />
      <PreferencesCard />
      <DangerCard />
    </div>
  );
}

import { settingsMetadata } from "@/constants/metadata";
import SettingsPage from "./components/SettingsPage";

export const metadata = settingsMetadata;

export default function Page() {
  return (
    <div className="p-6 flex flex-col gap-y-6">
      <h1 className="text-4xl font-medium">Paramètres</h1>
      <SettingsPage />
    </div>
  );
}

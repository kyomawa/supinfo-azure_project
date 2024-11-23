import { User } from "@prisma/client";
import SettingsCardVisibilityForm from "./SettingsCardVisibilityForm";
import SettingCardTheme from "./SettingCardTheme";

// ==================================================================================================================================

type SettingsCardProps = {
  user: User;
};

export default function SettingsCard({ user }: SettingsCardProps) {
  const { id, visibility } = user;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2.5 gap-x-12 p-4 border dark:bg-white/10 bg-black/5 dark:border-white/5 border-black/[0.025] rounded-lg">
      <SettingsCardVisibilityForm id={id} visibility={visibility} />
      <SettingCardTheme />
    </div>
  );
}

// ==================================================================================================================================

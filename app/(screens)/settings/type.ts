// Define TypeScript interfaces for our settings items
interface BaseSettingsItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  type: string;
}

interface LinkSettingsItem extends BaseSettingsItem {
  type: "link";
}

interface ActionSettingsItem extends BaseSettingsItem {
  type: "action";
}

interface ToggleSettingsItem extends BaseSettingsItem {
  type: "toggle";
  value: boolean;
  onValueChange: (value: boolean) => void;
}

type SettingsItem = LinkSettingsItem | ActionSettingsItem | ToggleSettingsItem;

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export {
  SettingsItem,
  SettingsSection,
  BaseSettingsItem,
  LinkSettingsItem,
  ActionSettingsItem,
  ToggleSettingsItem,
};

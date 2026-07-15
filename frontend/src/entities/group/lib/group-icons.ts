import {
  BookOpen,
  Brain,
  Globe,
  GraduationCap,
  Languages,
  Library,
  type LucideIcon,
  MessageCircle,
  PenLine,
} from 'lucide-react';

export const DEFAULT_GROUP_ICON = 'Languages';

export const GROUP_ICON_CATALOG = [
  { key: 'Languages', Icon: Languages },
  { key: 'BookOpen', Icon: BookOpen },
  { key: 'GraduationCap', Icon: GraduationCap },
  { key: 'Brain', Icon: Brain },
  { key: 'Globe', Icon: Globe },
  { key: 'Library', Icon: Library },
  { key: 'MessageCircle', Icon: MessageCircle },
  { key: 'PenLine', Icon: PenLine },
] as const;

export type GroupIconKey = (typeof GROUP_ICON_CATALOG)[number]['key'];

const STORAGE_KEY = 'chinese-laoshi-group-icons';

const iconMap = Object.fromEntries(GROUP_ICON_CATALOG.map(({ key, Icon }) => [key, Icon])) as Record<
  GroupIconKey,
  LucideIcon
>;

const readStorage = (): Record<string, GroupIconKey> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Record<string, GroupIconKey>;
  } catch {
    return {};
  }
};

const writeStorage = (data: Record<string, GroupIconKey>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getGroupIconKey = (groupId: string): GroupIconKey => {
  const stored = readStorage()[groupId];
  if (stored && stored in iconMap) {
    return stored;
  }
  return DEFAULT_GROUP_ICON;
};

export const getGroupIcon = (groupId: string): LucideIcon => {
  return iconMap[getGroupIconKey(groupId)] ?? Languages;
};

export const setGroupIcon = (groupId: string, iconKey: GroupIconKey) => {
  if (!(iconKey in iconMap)) {
    return;
  }
  writeStorage({ ...readStorage(), [groupId]: iconKey });
};

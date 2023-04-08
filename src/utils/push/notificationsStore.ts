import create from 'zustand';

type NotificationsStore = {
  enableNotifications: boolean;
  setEnableNotifications: (enable: boolean) => void;
};

const useNotifications = create<NotificationsStore>((set) => ({
  enableNotifications: true,
  setEnableNotifications: (enable: boolean) =>
    set({ enableNotifications: enable })
}));

export { useNotifications };

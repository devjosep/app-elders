import create from 'zustand';

import { getCurrentDatePlusHours } from '@client/common';

const ScreenName = {
  0: () => 'Listado de tipos de peticiones',
  1: (activityName) => `Descripción petición para ${activityName}`,
  2: (activityName) => `Selección de fecha y hora para ${activityName}`,
  3: (activityName) => `Para especificar una dirección para ${activityName}`,
  4: (activityName) => `Indicaciones para ${activityName}`,
  5: (activityName) => `Resumen petición para ${activityName}`
} as Record<number, (activityName: string) => string>;

type Activity = {
  id: number;
  nombre: string;
  description: string;
};

type WizardStatusValues = {
  step: number;
  activity?: Activity;
  date: Date;
  direction: string;
  additionalData: string;
  showingModal: boolean;
};

type WizardStatus = WizardStatusValues & {
  setActivity: (activity: Activity) => void;
  setStep: (step: number) => void;
  setDate: (date: Date) => void;
  setDirection: (direction: string) => void;
  setAdditionalData: (additionalData: string) => void;
  setShowingModal: (showingModal: boolean) => void;
  getScreenName: () => string;
  reset: () => void;
};

const wizardStatusInitialValue: WizardStatusValues = {
  step: 0,
  activity: undefined,
  date: getCurrentDatePlusHours(49),
  direction: '',
  additionalData: '',
  showingModal: false
};

const useWizardStatus = create<WizardStatus>((set, get) => ({
  selectedActivity: wizardStatusInitialValue.activity,
  date: wizardStatusInitialValue.date,
  step: wizardStatusInitialValue.step,
  direction: wizardStatusInitialValue.direction,
  additionalData: wizardStatusInitialValue.additionalData,
  showingModal: wizardStatusInitialValue.showingModal,
  setActivity: (activity: Activity) => set({ activity }),
  setStep: (step: number) => set({ step }),
  setDate: (date: Date) => {
    set({ date });
  },
  setDirection: (direction: string) => set({ direction }),
  setAdditionalData: (additionalData: string) => set({ additionalData }),
  setShowingModal: (showingModal: boolean) => set({ showingModal }),
  getScreenName: () =>
    get().showingModal
      ? 'modal'
      : ScreenName[get().step](get().activity?.nombre || ''),
  reset: () => set({ ...wizardStatusInitialValue })
}));

export { useWizardStatus };

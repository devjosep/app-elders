import create from 'zustand';

const getselectedLocationIds = (
  selectedLocations: Record<number, Record<number, boolean>>
) =>
  Object.keys(selectedLocations).reduce<number[]>(
    (accumulator, item) => [
      ...accumulator,
      ...Object.keys(selectedLocations[parseInt(item)])
        .filter(
          (quarterKey) =>
            selectedLocations[parseInt(item)][parseInt(quarterKey)]
        )
        .map((key) => parseInt(key))
    ],
    []
  );

const getCollaborationtypeIds = (collaborationTypes: Record<number, boolean>) =>
  Object.keys(collaborationTypes)
    .filter(
      (colaborationType) => collaborationTypes[parseInt(colaborationType)]
    )
    .map((key) => parseInt(key));

type FilterStatusState = {
  selectedCollaborationTypes: Record<number, boolean>;
  selectedLocations: Record<number, Record<string, boolean>>;
  collaborationTypesCount: number;
  locationSelectedCount: number;
  selectedLocationIds: number[];
  selectedCollaborationTypesIds: number[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
};

type FilterStatusActions = {
  setCollaborationTypes: (collaborationTypes: Record<number, boolean>) => void;
  setLocations: (locations: Record<number, Record<number, boolean>>) => void;
  cleanFilters: () => void;
  setStartDate: (startDate: Date | undefined) => void;
  setEndDate: (endDate: Date | undefined) => void;
  setStartTime: (startTime: string | undefined) => void;
  setEndTime: (endTime: string | undefined) => void;
};

type FilterStatus = FilterStatusState & FilterStatusActions;

const filterStatusInitialValue: FilterStatusState = {
  selectedCollaborationTypes: {},
  selectedLocations: {},
  collaborationTypesCount: 0,
  locationSelectedCount: 0,
  selectedLocationIds: [],
  selectedCollaborationTypesIds: [],
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined
};

const useFilter = create<FilterStatus>((set) => ({
  ...filterStatusInitialValue,
  setCollaborationTypes: (collaborationTypes: Record<number, boolean>) => {
    const selectedCollaborationTypesIds =
      getCollaborationtypeIds(collaborationTypes);
    set({
      selectedCollaborationTypes: collaborationTypes,
      selectedCollaborationTypesIds,
      collaborationTypesCount: selectedCollaborationTypesIds.length
    });
  },
  setLocations: (selectedLocations) => {
    const selectedLocationIds = getselectedLocationIds(selectedLocations);
    set({
      selectedLocations,
      selectedLocationIds,
      locationSelectedCount: selectedLocationIds.length
    });
  },
  setStartDate: (startDate) => {
    set({ startDate });
  },
  setEndDate: (endDate) => {
    set({ endDate });
  },
  setStartTime: (startTime) => {
    set({ startTime });
  },
  setEndTime: (endTime) => {
    set({ endTime });
  },
  cleanFilters: () => {
    set(filterStatusInitialValue);
  }
}));

export { useFilter };

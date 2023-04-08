export type District = {
  codigo: number;
  nombre: string;
};

export type Quarter = {
  codigo: number;
  nombre: string;
  distrito: number;
};

export type DistrictWithQuarters = {
  id: number;
  name: string;
  quarters: {
    id: number;
    name: string;
    districtId: number;
  }[];
};

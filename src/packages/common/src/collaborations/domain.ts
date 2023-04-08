export type Collaboration = {
  id: number;
  name: string;
  description: string;
  date: string;
  place: string;
  district: string;
  quarter: string;
  volunteerId: number;
  volunteerName: string;
  volunteerPhoto: string;
  citizenId: number;
  citizenName: string;
  citizenPhoto: string;
  status: number;
  extendedData?: string;
  elderCid360: string;
  volunteerCid360: string;

  fecha: string;
  hora: string;
  lugar: string;
  tipo: string;
};

export type CollaborationType = {
  id: number;
  name: string;
  description?: string;
  normalFlow?: boolean;
};

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
    nombre_voluntario: string;
    imagen_voluntario: string;
    datos_adicionales: string;
    cid360_voluntario: string;
    id_voluntario:number;
};
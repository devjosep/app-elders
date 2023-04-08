import { useAuth } from '../authentication/authStore';
import { Paginated } from '../shared';
import { doFetch } from '../utils';
import { jwtDecode } from '../utils/jwt';
import { doFetche } from '../utils/newFetcher';
import { Collaboration, CollaborationType } from './domain';

const ITEMS_PER_PAGE = 10;
export type CollaborationRequestType =
  | 'ELDER'
  | 'VOLUNTEER'
  | 'VOLUNTEER_SEARCH';

export enum CollaborationStatus {
  Active = 0,
  Accept = 1,
  Finished = 2,
  Undone = 3
}

type GetCollaborations = (
  key: string,
  collaborationRequestType: CollaborationRequestType,
  status: CollaborationStatus[],
  collaborationTypes: number[],
  locations: number[],
  startDate: Date | undefined,
  endDate: Date | undefined,
  startTime: string | undefined,
  endTime: string | undefined,
  cursor: number
) => Promise<Paginated<Collaboration>>;

type GetCollaborationsRequest = {
  status: CollaborationStatus[];
  items: number;
  skip: number;
  services?: number[];
  quarter?: number[];
  districts?: number[];
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
};

export const getElderCollaborations = async () => {
  const tokenAzure = await useAuth.getState().getToken();
  const token = jwtDecode(tokenAzure ? tokenAzure : '');
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      TOKEN_AUTHENTICATION: token.ayto_token
    },
    body: JSON.stringify({
      type: '',
      code_cid360: '',
      status: '',
      cod_servicios: '',
      cod_distritos: '',
      cod_barrios: '',
      items: 10,
      skip: 0,
      orden: ''
    })
  };
  const response = await fetch(
    'https://voluntariado.madrid.es/ws/request/search?version=true',
    requestOptions
  );
  const json = await response.json();

  return json;
};
const getVolunteerCollaborations = (
  cursor = 0,
  status: CollaborationStatus[]
) =>
  doFetch<GetCollaborationsRequest, Paginated<Collaboration>>({
    url: 'collaboration/volunteer/search',
    method: 'POST',

    request: {
      items: ITEMS_PER_PAGE,
      skip: cursor * ITEMS_PER_PAGE,
      status
    }
  });

const getVolunteerSearch = (
  cursor = 0,
  status: CollaborationStatus[],
  services: number[],
  locations: number[],
  startDate: Date | undefined,
  endDate: Date | undefined,
  startTime: string | undefined,
  endTime: string | undefined
) =>
  doFetch<GetCollaborationsRequest, Paginated<Collaboration>>({
    url: 'collaboration/volunteer/searchnewcollaborations',
    method: 'POST',
    request: {
      items: ITEMS_PER_PAGE,
      skip: cursor * ITEMS_PER_PAGE,
      status,
      quarter: locations ?? [],
      services: services ?? [],
      startDate,
      endDate,
      startTime,
      endTime,
      districts: []
    }
  });

const collaborationsRequestTypes: Record<CollaborationRequestType, any> = {
  ELDER: getElderCollaborations,
  VOLUNTEER: getVolunteerCollaborations,
  VOLUNTEER_SEARCH: getVolunteerSearch
};

export const getCollaborations: GetCollaborations = (
  _,
  collaborationRequestType = 'ELDER',
  status = [CollaborationStatus.Active],
  collaborationTypes = [9],
  locations = [],
  startDate = new Date(),
  endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  startTime,
  endTime,
  cursor = 0
) => {
  // console.log('sssssssss ', status);

  return collaborationsRequestTypes[collaborationRequestType](
    cursor,
    status,
    collaborationTypes,
    locations,
    startDate,
    endDate,
    startTime,
    endTime
  );
};

export async function getCollaborationTypes() {
  const tokenAzure = await useAuth.getState().getToken();
  const token = jwtDecode(tokenAzure ? tokenAzure : '');
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      TOKEN_AUTHENTICATION: token.ayto_token
    }
  };
  const response = await fetch(
    'https://voluntariado.madrid.es/ws/type_request?version=true',
    requestOptions
  );
  console.log('eq  op ---< ', requestOptions);
  const json = await response.json();

  return json.value;
}

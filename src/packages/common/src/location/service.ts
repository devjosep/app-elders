import { doFetch } from '../utils';
import { District, Quarter, DistrictWithQuarters } from './domain';

export const getDistricts = (): Promise<District[]> =>
  doFetch({ url: 'districts', method: 'GET' });

export const getQuarters = (): Promise<Quarter[]> =>
  doFetch({ url: 'quarters', method: 'GET' });

export const getLocations = async (): Promise<DistrictWithQuarters[]> => {
  const districts = await getDistricts();
  const quarters = await getQuarters();

  const districtsWithQuarters: DistrictWithQuarters[] = districts.map(
    ({ codigo, nombre }) => ({
      id: codigo,
      name: nombre,
      quarters: quarters
        .filter((quarter) => quarter.distrito === codigo)
        .map(({ codigo, nombre, distrito }) => ({
          id: codigo,
          name: nombre,
          districtId: distrito
        }))
    })
  );

  return districtsWithQuarters;
};

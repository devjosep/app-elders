export enum UserType {
  ELDER = 'elder',
  VOLUNTEER = 'volunteer'
}

export type UserProfile = {
  cid360: string;
  name: string;
  phone: string;
  email: string;
  userType: UserType;
  image?: string;
};

export type UserCredentials = {
  token: string;
  tokenExpirationDate?: Date;
  isLoggedIn: boolean;
  isTokenExpired: boolean;
};

export type VolunteerInformation = {
  name: string;
  image: string;
};

export type ElderInformation = {
  name: string;
  phone: string;
};

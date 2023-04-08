import { ChangePassword } from './changePassword';
import EditProfile from './edit/EditProfile';
import RemoveProfile from './remove/RemoveProfile';
import {
  CameraHeader,
  ChangePasswordHeader,
  EditProfileHeader,
  PerfilHeader,
  RemoveProfileHeader
} from './shared/Header';
import CameraInterface from './view/Camera';
import Profile from './view/Profile';

export type RouteParams = {
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  RemoveProfile: undefined;
  CameraInterface: undefined;
};

const TabRoutes = [
  {
    routeName: 'Profile',
    component: Profile
  }
];

const StackRoutes = [
  {
    routeName: 'EditProfile',
    component: EditProfile,
    header: EditProfileHeader
  },
  {
    routeName: 'ChangePassword',
    component: ChangePassword,
    header: ChangePasswordHeader
  },
  {
    routeName: 'RemoveProfile',
    component: RemoveProfile,
    header: RemoveProfileHeader
  },
  {
    routeName: 'CameraInterface',
    component: CameraInterface,
    header: CameraHeader
  }
];

export { TabRoutes, StackRoutes };

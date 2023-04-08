import { ThemeComponent } from '../theme/theme';
import { Role, Constants } from './ThemeProvider';

export type BuildStyles = {
  theme: ThemeComponent;
  role: Role;
  constants: Constants;
};

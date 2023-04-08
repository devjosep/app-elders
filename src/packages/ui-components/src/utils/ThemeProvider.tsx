import React, { useState, useMemo } from 'react';

import { BASE, BASE_DARK, GREY_SCALE, COMPLEMENTARY } from '../theme/colors';
import { FF, FS, FW, Z_INDEX, RADIUS, OPACITY } from '../theme/global';
import { ThemeComponent, ITheme, defaultTheme } from '../theme/theme';
import useColorScheme from './useColorScheme';

export type Role = 'elders' | 'volunteers';

type ConstantsType =
  | 'FF'
  | 'FS'
  | 'FW'
  | 'Z_INDEX'
  | 'RADIUS'
  | 'OPACITY'
  | 'BASE'
  | 'BASE_DARK'
  | 'GREY_SCALE'
  | 'COMPLEMENTARY';

export type Constants = {
  [constantType in ConstantsType]: Record<string, any>;
};

type Theme = {
  fullTheme: ITheme;
  theme: ThemeComponent;
  role: Role;
  constants: Constants;
  changeRole: (selectedRole: Role) => void;
};

const themeInitialValue: Theme = {
  fullTheme: defaultTheme,
  theme: defaultTheme['light'],
  constants: {
    FF,
    FS,
    FW,
    Z_INDEX,
    RADIUS,
    OPACITY,
    BASE,
    BASE_DARK,
    GREY_SCALE,
    COMPLEMENTARY
  },
  role: 'elders',
  changeRole: () => {}
};

const ThemeContext = React.createContext(themeInitialValue);

type ThemePropviderProps = {
  theme?: ITheme;
  role?: Role;
};

export const ThemeProvider: React.FC<ThemePropviderProps> = ({
  theme,
  role,
  children
}) => {
  const currentColorScheme = useColorScheme();
  const [themeObj] = useState(theme ?? themeInitialValue.fullTheme);
  const [currentRole, changeRole] = useState(role ?? 'elders');

  const setRole = (role: Role) => changeRole(role);

  const contextValue = useMemo(
    () => ({
      theme: themeObj[currentColorScheme],
      constants: themeInitialValue.constants,
      role: currentRole,
      fullTheme: themeObj,
      changeRole: (role: Role) => setRole(role)
    }),
    [themeObj, currentRole, currentColorScheme]
  );
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

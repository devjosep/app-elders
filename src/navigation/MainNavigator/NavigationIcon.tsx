import React from 'react';
import { View, StyleSheet } from 'react-native';

import CollaborationsIcon from '../../assets/icons/help.svg';
import RequestsFillIcon from '../../assets/icons/helpFill.svg';
import HomeIcon from '../../assets/icons/home.svg';
import HomeFillIcon from '../../assets/icons/homeFill.svg';
import MessagesIcon from '../../assets/icons/messages.svg';
import MessagesFillIcon from '../../assets/icons/messagesFill.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import ProfileFillIcon from '../../assets/icons/profileFill.svg';

import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

type IconName = 'Home' | 'Collaborations' | 'Messages' | 'Profile';

const ICONS = {
  Home: HomeIcon,
  Collaborations: CollaborationsIcon,
  Messages: MessagesIcon,
  Profile: ProfileIcon
};

const FOCUSED_ICONS = {
  Home: HomeFillIcon,
  Collaborations: RequestsFillIcon,
  Messages: MessagesFillIcon,
  Profile: ProfileFillIcon
};

type NavigationIconProps = {
  name: IconName;
  focused?: boolean;
};

const NavigationIcon = ({ name, focused = false }: NavigationIconProps) => {
  const SelectedIcon = focused ? FOCUSED_ICONS[name] : ICONS[name];
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View
      style={[
        styles.navigationIcon,
        { backgroundColor: focused ? theme.bgAccent : 'transparent' }
      ]}
    >
      <SelectedIcon height={40} width={40} />
    </View>
  );
};

export { NavigationIcon };

const buildStyles = ({ theme, constants: { RADIUS } }: BuildStyles) =>
  StyleSheet.create({
    navigationIcon: {
      alignItems: 'center',
      borderRadius: RADIUS.circle,
      color: theme.fontColorBase,
      height: 56,
      justifyContent: 'center',
      width: 56
    }
  });

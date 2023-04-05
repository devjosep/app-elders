import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';
import { getFirstLetters } from '@client/common/src/utils';

import { useTheme, BuildStyles } from '../utils';
import { Loading } from './Loading';

type ProfilePictureProps = {
  pictureUrl?: string;
  user: string;
  width: number;
  height: number;
  isBase64Picture?: boolean;
};

const ProfilePicture = ({
  pictureUrl = '',
  isBase64Picture = false,
  user,
  width,
  height
}: ProfilePictureProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const [loading, setLoading] = useState(false);

  const { theme, role, constants } = useTheme();

  const styles = buildStyles({ role, theme, constants });

  return pictureUrl ? (
    <View
      {...accessibility(
        {},
        {
          accessible: false,
          accessibilityElementsHidden: true,
          importantForAccessibility: 'no-hide-descendants'
        }
      )}
      style={[
        styles.ProfilePictureView,
        { width, height, borderRadius: width / 2 }
      ]}>
      <Image
        style={[
          styles.ProfilePicture,
          { width, height, borderRadius: width / 2 }
        ]}
        source={{
          uri: isBase64Picture
            ? `data:image/jpeg;base64,${pictureUrl}`
            : pictureUrl
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
        }}
      />
      {loading ? <Loading style={styles.Loading} /> : null}
    </View>
  ) : (
    <View
      {...accessibility(
        {},
        {
          accessible: false,
          accessibilityElementsHidden: true,
          importantForAccessibility: 'no-hide-descendants'
        }
      )}
      style={[
        styles.ProfilePictureView,
        { width, height, borderRadius: width / 2 }
      ]}>
      {user ? (
        <Text style={styles.ProfilePictureFallback}>
          {getFirstLetters(user)}
        </Text>
      ) : null}
    </View>
  );
};

export { ProfilePicture };

const buildStyles = ({ theme, constants: { FS } }: BuildStyles) =>
  StyleSheet.create({
    ProfilePicture: {
      resizeMode: 'cover'
    },
    ProfilePictureView: {
      position: 'relative',
      alignItems: 'center',
      backgroundColor: theme.fontColorBase,

      borderWidth: 2,
      justifyContent: 'center',
      overflow: 'hidden',
      resizeMode: 'cover'
    },
    ProfilePictureFallback: {
      color: theme.fontColorNegative,
      fontSize: FS.M
    },
    Loading: {
      position: 'absolute'
    }
  });

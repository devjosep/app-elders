import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useMutation } from 'react-query';

import { useAuth } from '@client/common';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { ProfileFormModel } from '../domain';
import { updateProfile } from '../service';
import { Form } from './EditProfile/Form';

const EditProfile = () => {
  const navigation = useNavigation();
  const updateUser = useAuth((s) => s.updateUser);

  const {
    mutateAsync: editProfile,
    isError,
    isLoading
  } = useMutation(updateProfile);
  const { theme, constants, role } = useTheme();

  const styles = buildStyles({ theme, constants, role });

  const onSubmit = async (data: ProfileFormModel) => {
    await editProfile(data);
    updateUser(data.name.trim(), data.phone);
    navigation.navigate('Profile');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Form
        isActionDisabled={isLoading}
        isError={isError}
        onSubmit={onSubmit}
      />
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const buildStyles = ({ theme }: BuildStyles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bgSecondary
    }
  });

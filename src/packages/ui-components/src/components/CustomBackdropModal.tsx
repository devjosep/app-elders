import React from 'react';
import { StyleSheet, View } from 'react-native';

type CustomBackdropModalProps = {
  backgroundColor?: string;
};

const CustomBackdropModal = ({
  backgroundColor = 'white'
}: CustomBackdropModalProps) => {
  const styles = buildStyles({ backgroundColor });

  return <View style={styles.container} />;
};

export { CustomBackdropModal };

const buildStyles = ({ backgroundColor }: CustomBackdropModalProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
      opacity: 0.88
    }
  });

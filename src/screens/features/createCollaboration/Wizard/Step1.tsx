import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';

import { useQuery } from 'react-query';

import {
  getCollaborationTypes,
  CollaborationType,
  useAccessibilityAutoFocus
} from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { WizardStepProps } from '../domain';
import { useWizardStatus } from 'stores/wizardStore';

type Step1Props = {
  otherService: () => void;
} & WizardStepProps;

const Step1 = ({ otherService, goNext }: Step1Props) => {
  const { data } = useQuery<CollaborationType[]>(
    'collaborationTypes',
    getCollaborationTypes
  );
  const { accessibility } = useAccessibilityAutoFocus();
  const setActivity = useWizardStatus((x) => x.setActivity);
  console.log(data)
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View style={styles.container}>
      <View>
        <Text
          {...accessibility(
            { label: '¿Qué tipo de ayuda necesitas?', role: 'text' },
            { accessible: true }
          )}
          style={styles.title}>
          ¿Qué tipo de ayuda necesitas?
        </Text>
      </View>
      
      <FlatList
        style={styles.requestTypeList}
          data={data}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
            <Button
              {...accessibility(
                { label: item.name, role: 'button' },
                { accessible: true }
            )}
            text={item.name}
            onPress={() =>
                item.normalFlow
                  ? (setActivity(item), goNext?.())
                  : item.id === 9
                  ? (setActivity(item), goNext?.())
                  : otherService()
            }
          />
        )}
        keyExtractor={(item, index) => `${item.id.toString()}_${index}`}
      />
      </View>
  );
  
};

export default Step1;

const buildStyles = ({ theme, constants: { FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: theme.bgSecondary,
      paddingBottom: 24
    },
    title: {
      fontFamily: FF.regular,
      fontSize: FS.L,
      lineHeight: 30,
      paddingBottom: 20
    },
    separator: {
      height: 16,
      backgroundColor: 'transparent'
    },
    requestTypeList: {
      paddingHorizontal: 32,
      alignSelf: 'stretch'
    }
  });

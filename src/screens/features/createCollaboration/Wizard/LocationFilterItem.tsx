import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common';
import { DistrictWithQuarters } from '@client/common/src/location';
import { Checkbox } from '@client/ui-components/src/components';
import { BuildStyles, useTheme } from '@client/ui-components/src/utils';

import ChevronOpenIcon from 'icons/chevronDown.svg';
import ChevronCloseIcon from 'icons/chevronUp.svg';

type LocationFilterItemProps = {
  locationsSelected: Record<number, boolean>;
  toggleDistrict: (
    districtId: number,
    quarterIds: number[],
    setValue: boolean
  ) => void;
  toggleQuarter: (districtId: number, quarterId: number) => void;
  item: DistrictWithQuarters;
};

const LocationFilterItem = ({
  item,
  toggleQuarter,
  toggleDistrict,
  locationsSelected = {}
}: LocationFilterItemProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const [areQuartersVisible, setQuartersVisible] = useState(false);

  const { theme, constants } = useTheme();

  const styles = buildStyles({ theme, constants });

  const selectedQuartersCount = Object.keys(locationsSelected).filter(
    (location) => locationsSelected[Number(location)]
  ).length;
  const allQuartersSelected = selectedQuartersCount === item.quarters.length;

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.collapsedContainer}
          activeOpacity={1}
          onPress={() => setQuartersVisible(!areQuartersVisible)}
        >
          <View style={styles.chevronIconHeader}>
            {!areQuartersVisible ? (
              <ChevronOpenIcon
                height={16}
                width={16}
                style={{ color: theme.fontColorBase } as never}
              />
            ) : (
              <ChevronCloseIcon
                height={16}
                width={16}
                style={{ color: theme.fontColorAccent } as never}
              />
            )}
          </View>
          <Text
            {...accessibility(
              {
                label: `Distrito ${item.name}. Barrios seleccionados: ${selectedQuartersCount}`,
                state: {
                  expanded: areQuartersVisible
                }
              },
              { accessible: true }
            )}
            style={[
              styles.textHeader,
              selectedQuartersCount > 0 && styles.headerSelected
            ]}
            numberOfLines={1}
            lineBreakMode='tail'
          >
            {item.name.toLowerCase()}
            {selectedQuartersCount > 0 ? (
              <Text>({selectedQuartersCount})</Text>
            ) : null}
          </Text>
        </TouchableOpacity>
        <Checkbox
          {...accessibility(
            {
              label: `Filtrar por todo el distrito de ${item.name}`,
              state: { selected: allQuartersSelected }
            },
            { accessible: true }
          )}
          defaultValue={allQuartersSelected}
          onPress={() =>
            toggleDistrict(
              item.id,
              item.quarters.map((quarter) => quarter.id),
              !allQuartersSelected
            )
          }
        />
      </View>
      {areQuartersVisible ? (
        <View style={styles.tagListContainer}>
          {item.quarters.map((quarter) => (
            <TouchableOpacity
              {...accessibility(
                {
                  label: `Barrio ${quarter.name} del distrito ${item.name}`,
                  state: {
                    selected: locationsSelected?.[quarter.id]
                  },
                  role: 'checkbox'
                },
                { accessible: true }
              )}
              key={quarter.id}
              style={[
                styles.tagFilter,
                locationsSelected?.[quarter.id] && styles.tagFilterSelected
              ]}
              onPress={() => toggleQuarter(item.id, quarter.id)}
            >
              <Text
                style={[
                  styles.tagFilterText,
                  locationsSelected?.[quarter.id] &&
                    styles.tagFilterTextSelected
                ]}
              >
                {quarter.name.toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const buildStyles = ({
  theme,
  constants: { FF, FS, RADIUS }
}: Pick<BuildStyles, 'theme' | 'constants'>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlignVertical: 'center',
      paddingLeft: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider
    },
    collapsedContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 16,
      height: 60
    },
    chevronIconHeader: {
      marginRight: 8
    },
    textHeader: {
      fontFamily: FF.regular,
      fontSize: FS.M,
      lineHeight: 24,
      color: theme.fontColorBase,
      textTransform: 'capitalize'
    },
    headerSelected: {
      fontFamily: FF.semiBold
    },
    tagFilterText: {
      fontSize: FS.S,
      fontFamily: FF.regular,
      lineHeight: 20,
      textTransform: 'capitalize',
      flexWrap: 'wrap',
      color: theme.bcTagFilter
    },
    tagFilterTextSelected: {
      color: theme.fontColorNegative
    },
    tagFilter: {
      borderRadius: RADIUS.M,
      borderWidth: 2,
      borderColor: theme.bcTagFilter,
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 0,
      marginBottom: 12,
      marginRight: 12,
      height: 48,
      alignItems: 'center'
    },
    tagFilterSelected: {
      backgroundColor: theme.cTagFilterSelected,
      borderColor: theme.cTagFilterSelected
    },
    tagListContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 20,
      borderBottomColor: theme.divider,
      borderBottomWidth: 1
    }
  });

export { LocationFilterItem };

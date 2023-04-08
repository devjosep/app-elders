import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
  dateToString,
  dateToTimeString,
  // Collaboration,
  useAccessibilityAutoFocus
} from '@client/common';

import { Collaboration } from '../types';


import { ProfilePicture } from '@client/ui-components/src/components/ProfilePicture';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import DetailsIcon from 'icons/chevronRight.svg';
import SandClockIcon from 'icons/sandClock.svg';

type CollaborationItemProps = {
  collaboration: Collaboration;
};

const CollaborationItem = memo(({ collaboration }: CollaborationItemProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const navigation = useNavigation();
  const { role, theme, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  console.log(" **** item -col  .> ", collaboration)


// let  status_item =  collaboration.status=="active" ? 0 : null

  return (
    <View style={styles.card}>

      <View
        {...accessibility(
          {
            label: `Petición para ${collaboration.name}`,
            role: 'text'
          },
          { accessible: true }
        )}
        style={[
          styles.cardHeader,
          collaboration.status === 0 ? styles.isPassed : null,
          //  status_item== 0 ? styles.isPassed : null,
          collaboration.id_voluntario === 0 ? styles.noBooked : styles.booked
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.cardTitle,
            collaboration.status === 0 ? styles.isPassed : null,
            collaboration.id_voluntario === 0 ? styles.noBooked : styles.booked
          ]}
        >
          {collaboration.tipo}
        </Text>
      </View>
      <View style={styles.cardStatus}>
        {collaboration.id_voluntario === 0 ? (
          <>
            <SandClockIcon width={28} height={33} />
            <Text
              {...accessibility(
                {
                  label: `Estado de la petición: esperando voluntario`,
                  role: 'text'
                },
                { accessible: true }
              )}
              style={styles.statusText}
            >
              Esperando voluntari@
            </Text>
          </>
        ) : (
          <View
            {...accessibility(
              {
                label: `El colaborador que te va a acompañar es: ${collaboration.volunteerName}`,
                role: 'text'
              },
              { accessible: true }
            )}
            style={{ flexDirection: 'row' }}
          >
            <ProfilePicture
              {...accessibility(
                {
                  label: `Imagen perfil del colaborador ${collaboration.volunteerName}`,
                  role: 'text'
                },
                { accessible: true }
              )}
              user={collaboration.volunteerName}
              width={46}
              height={46}
              isBase64Picture
              pictureUrl={collaboration?.imagen_voluntario}
            />
            <Text style={styles.statusTextWithCollaboration}>
              {collaboration?.nombre_voluntario}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.ColaborationInfo}>
          <View
            {...accessibility(
              {
                label: `Fecha petición:}`
              },
              { accessible: true }
            )}
            style={styles.infoItem}
          >
            <Text style={styles.infoKey}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {collaboration?.fecha}
            </Text>
          </View>
          <View
            {...accessibility(
              {
                label: `Hora petición: 
                )}`
              },
              { accessible: true }
            )}
            style={styles.infoItem}
          >
            <Text style={styles.infoKey}>Hora:</Text>
            <Text style={styles.infoValue}>
              {collaboration?.hora}
            </Text>
          </View>
          <View
            {...accessibility(
              {
                label: `Lugar petición: ${collaboration.place}`,
                role: 'text'
              },
              { accessible: true }
            )}
            style={styles.infoItem}
          >
            <Text style={styles.infoKey}>Lugar:</Text>
            <Text style={styles.infoValue}>{collaboration.lugar}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <TouchableOpacity
          {...accessibility(
            {
              label: 'Ver detalle petición',
              hint: 'Ir a detalle de petición',
              role: 'button'
            },
            { accessible: true }
          )}
          style={styles.btnDetails}
          onPress={() =>
            navigation.navigate('CollaborationDetail', {
              collaboration
            })
          }
        >
          <Text style={styles.btnDetailsText}>Ver petición</Text>
          <DetailsIcon width={20} height={20} style={styles.btnDetailsIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export { CollaborationItem };

const buildStyles = ({ theme, constants: { RADIUS, FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.bgSecondary,
      borderColor: theme.fontColorBase,
      borderRadius: RADIUS.S,
      borderWidth: 2,
      elevation: 10,
      flex: 1,
      flexDirection: 'column',
      minHeight: 300,
      justifyContent: 'flex-start',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.34,
      shadowRadius: 6.27
    },
    cardHeader: {
      backgroundColor: theme.primary,
      borderBottomWidth: 2,
      height: 54,
      justifyContent: 'center',
      paddingHorizontal: 16
    },
    cardTitle: {
      color: theme.fontColorNegative,
      fontFamily: FF.semiBold,
      fontSize: FS.L,
      letterSpacing: 0
    },
    cardStatus: {
      alignItems: 'center',
      borderBottomWidth: 2,
      borderColor: theme.divider,
      flexDirection: 'row',
      minHeight: 60,
      paddingHorizontal: 16,
      justifyContent: 'flex-start'
    },
    statusText: {
      paddingLeft: 12,
      color: theme.fontColorBase,
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      letterSpacing: 0.3
    },
    statusTextWithCollaboration: {
      alignSelf: 'center',
      paddingLeft: 12,
      color: theme.fontColorBase,
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      letterSpacing: 0.3
    },
    cardContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 16
    },
    btnDetails: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    btnDetailsIcon: {
      color: theme.fontColorBase,
      marginTop: -2,
      marginLeft: 8
    },
    btnDetailsText: {
      height: 48,
      textAlignVertical: 'center',
      fontSize: FS.LL,
      color: theme.fontColorBase,
      fontFamily: FF.semiBold,
      lineHeight: 43
    },
    ColaborationInfo: {
      flex: 1
    },
    infoItem: {
      flexDirection: 'row',
      marginBottom: 10
    },
    infoKey: {
      color: theme.fontColorBase,
      fontFamily: FF.semiBold,
      fontSize: FS.M,
      flex: 1
    },
    infoValue: {
      color: theme.fontColorBase,
      flex: 3,
      fontFamily: FF.regular,
      fontSize: FS.XM
    },
    isPassed: {
      color: theme.fontColorBase,
      backgroundColor: theme.bgDefault
    },
    noBooked: {
      color: theme.fontColorNegative,
      backgroundColor: theme.bgAccent
    },
    booked: {
      color: theme.fontColorNegative,
      backgroundColor: theme.primary
    }
  });

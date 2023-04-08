import React, { useState, Suspense, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Modal from 'react-native-modal';
import { useMutation } from 'react-query';

import {
  dateToString,
  dateToTimeString,
  useAuth,
  createEmptyConversation,
  UserType,
  useAccessibilityAutoFocus,
  CollaborationStatus,
  toTimeZonedDate
} from '@client/common';
import { CustomBackdropModal } from '@client/ui-components/src/components';
import { Button } from '@client/ui-components/src/components/Button';
import { Loading } from '@client/ui-components/src/components/Loading';
import { ProfilePicture } from '@client/ui-components/src/components/ProfilePicture';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from './routes';
import IconClose from '../../../assets/icons/close.svg';

const MODAL_DELAY = 100;

type DetailsProps = {
  detailsData: {
    date: string;
    hora: string;
    place: string;
    description: string;
  };
};

type VolunteerData = {
  volunteerData: {
    volunteerName: string;
    collaborationType: string;
    pictureUrl: string;
    volunteerCid360: string;
    status: number;
    hora: string;
  };
};

const NoVolunteer = () => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View
      {...accessibility(
        {
          label: 'Esperando que haya una persona voluntaria disponible',
          role: 'text'
        },
        { accessible: true }
      )}
      style={styles.volunteer}
    >
      <View style={styles.volunteerPicture}>
        <ImageBackground
          source={require('../../../assets/images/chicle.png')}
          style={[
            styles.volunteerPictureBackground,
            {
              height: 160,
              width: 160
            }
          ]}
        />
      </View>
      <Text style={styles.noVolunteerCaption}>
        Esperando que haya una persona voluntaria disponible
      </Text>
    </View>
  );
};

const Volunteer = ({
  volunteerData: {
    volunteerName,
    collaborationType,
    pictureUrl,
    volunteerCid360,
    status,

  }
}: VolunteerData) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const navigation = useNavigation();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const { mutateAsync: updateConversation } = useMutation(
    createEmptyConversation,
    {
      onSuccess: () => {
        navigation.navigate('ChatSession', {
          destinationUserId: volunteerCid360.toString(),
          collaborationType
        });
      }
    }
  );

  // Active = 0,
  //   Accept = 1,
  //   Finished = 2,
  //   Undone = 3
  let new_status: number = status == "active" ? 0 : (status == "accept") ? 1 : (status == "finished") ? 2 : 3;

  return (
    <View style={styles.volunteer}>
      <View style={styles.volunteerPicture}>
        {new_status == 1 || new_status == 2 ? (
           <ImageBackground
           {...accessibility(
             {},
             {
               accessible: false,
               accessibilityElementsHidden: true,
               importantForAccessibility: 'no-hide-descendants'
             }
           )}
           source={require('../../../assets/images/chicle.png')}
           style={[
             styles.volunteerPictureBackground,
             {
               height: 160,
               width: 160
             }
           ]}
         >
          
           <ProfilePicture
             user={volunteerName}
             pictureUrl={pictureUrl}
             width={130}
             height={130}
             isBase64Picture
           />
         </ImageBackground>
          ):(
            <ImageBackground
           {...accessibility(
             {},
             {
               accessible: false,
               accessibilityElementsHidden: true,
               importantForAccessibility: 'no-hide-descendants'
             }
           )}
           source={require('../../../assets/images/chicle.png')}
           style={[
             styles.volunteerPictureBackground,
             {
               height: 160,
               width: 160
             }
           ]}
         ></ImageBackground>
          )}
       
      </View>
      <View
        {...accessibility(
          {
            label:
              volunteerName +
              (new_status == 1
                ? ' será la persona voluntaria que te acompañará. Nota: Por favor, cancelar la petición con un mínimo de dos horas de antelación'
                : ' es la persona voluntaria que te acompañó'),
            role: 'text'
          },
          { accessible: true }
        )}
        style={styles.volunteerNameWrapper}
      >
        <Text style={styles.volunteerName}>{volunteerName}</Text>
        {new_status == 1  ? (
          <Text style={styles.volunteerCaption}>
            Será la persona <Text style={styles.strongText}>voluntaria</Text>{' '}
            que te acompañará.
          </Text>
        ) : new_status == 2 ? (
          <Text style={styles.volunteerCaption}>
            Es la persona <Text style={styles.strongText}>voluntaria</Text> que
            te acompañó.
          </Text>
        ): new_status == 3 ?(
          <Text style={styles.volunteerCaption}>
           Esperando que haya una persona voluntaria disponible
          </Text>
        ):(
            <Text style={styles.volunteerCaption}>
              Es la persona <Text style={styles.strongText}>voluntaria</Text> que
              te acompañó.
            </Text>
        )}
        {new_status == 1 && (
          <Text style={styles.volunteerCaption}>
            Nota: Por favor, cancelar la petición con un mínimo de dos horas de
            antelación
          </Text>
        )}
      </View>
      <View style={styles.volunteerFooter}>
        {new_status == 1 ? (
          <Button
            {...accessibility(
              {
                label: 'Enviar mensaje',
                hint: 'Ir al chat para enviar un mensaje al voluntario',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Enviar mensaje'
            onPress={async () => {
              await updateConversation({
                recipientCid360: volunteerCid360.toString(),
                recipientName: volunteerName,
                recipientPicture: pictureUrl,
                collaborationType,
                userType: UserType.ELDER
              });
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

const Details = ({
  detailsData: { date, place, description, hora }
}: DetailsProps) => {
  const { accessibility } = useAccessibilityAutoFocus();
  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  return (
    <View>
      <View style={styles.info}>
        <View
          {...accessibility(
            {
              label: `Fecha petición:`
            },
            { accessible: true }
          )}
          style={styles.infoItem}
        >
          <Text style={styles.infoItemKey}>Fecha:</Text>
          <Text style={styles.infoItemValue}>{date}</Text>
        </View>
        <View
          {...accessibility(
            {
              label: `Hora petición:`
            },
            { accessible: true }
          )}
          style={styles.infoItem}
        >
          <Text style={styles.infoItemKey}>Hora:</Text>
          <Text style={styles.infoItemValue}>
            {hora}
          </Text>
        </View>
        <View
          {...accessibility(
            {
              label: `Lugar petición: ${place}`,
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.infoItem}
        >
          <Text style={styles.infoItemKey}>Lugar:</Text>
          <Text style={styles.infoItemValue}>{place}</Text>
        </View>
        <View
          {...accessibility(
            {
              label: `Indicaciones petición: ${description}`,
              role: 'text'
            },
            { accessible: true }
          )}
          style={styles.infoItem}
        >
          <Text
            style={styles.infoItemKey}
            numberOfLines={1}
            lineBreakMode='tail'
          >
            Indicaciones:
          </Text>
          <Text style={styles.infoItemValue}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const RequestDetailInner = () => {
  const { accessibility, focusOnElement } = useAccessibilityAutoFocus();

  const user = useAuth((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<Text>(null);

  const {
    params: { collaboration }
  } = useRoute<RouteProp<RouteParams, 'CollaborationDetail'>>();

  const navigation =
    useNavigation<StackNavigationProp<RouteParams, 'CollaborationDetail'>>();

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const expiredCollaboration = 1;


  const state =
    collaboration.status === 0
      ? 'esperando voluntario'
      : collaboration.status === 0
        ? 'ya realizada'
        : 'en curso';


  // console.log(" chamo cool --< ", collaboration)

  // const state =
  //   collaboration.status === "active"
  //     ? 'esperando voluntario'
  //     : collaboration.status === 0
  //     ? 'ya realizada'
  //     : 'en curso';

  useEffect(() => {
    if (showModal) {
      setTimeout(() => focusOnElement(modalRef), MODAL_DELAY);
    }
  }, [showModal]);

  // let status_collaboration = collaboration.status == "active" ? 1 : 2;

  // console.log("ddd isla sssd ", collaboration.status)


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.wrapper}>
        <View
          {...accessibility(
            {
              label: `Detalle de petición para ${collaboration.name}. Estado de la petición: ${state}`,
              role: 'text'
            },
            { accessible: true }
          )}
          style={[
            styles.header,
            collaboration.status === 'accept' ? styles.isPassed : null,
            collaboration.status === 'active' ? styles.noBooked : styles.booked,
            collaboration.status === 'expired' ? styles.noBooked : styles.booked
          ]}
        >
          <Text
            style={[
              styles.title,
              collaboration.status === 'accept' ? styles.isPassed : null,
              collaboration.status === 'active' ? styles.noBooked : styles.booked,
              collaboration.status === 'expired' ? styles.noBooked : styles.booked
            ]}  
          >
            {collaboration.tipo}
          </Text>
        </View>
        <View>
          {collaboration.volunteerId === 0 ? (
            <NoVolunteer />
          ) : (
            <Volunteer
              volunteerData={{
                volunteerName: collaboration.nombre_voluntario,
                pictureUrl: collaboration.imagen_voluntario,
                collaborationType: collaboration.tipo,
                // volunteerCid360: collaboration.volunteerCid360,
                volunteerCid360: collaboration.cid360_voluntario,
                status: collaboration.status,
                hora: collaboration.hora
                // volunteerName: collaboration.volunteerName,
                // pictureUrl: collaboration.volunteerPhoto,
                // collaborationType: collaboration.name,
                // volunteerCid360: collaboration.volunteerCid360,
                // status: collaboration.status
              }}
            />
          )}
          <Details
            detailsData={{
              date: collaboration.fecha,
              hora: collaboration.hora,
              place: collaboration.lugar,
              description: collaboration.datos_adicionales || 'Sin indicaciones'
            }}
          />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 16 }}>
        {/* {collaboration.status !== CollaborationStatus.Finished && */}
        {collaboration.status == "accept" || collaboration.status == "active" ? (
          <Button
            {...accessibility(
              {
                label: 'Cancelar petición',
                hint: 'Ir a cancelar petición',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Cancelar petición'
            variant='secondary'
            onPress={() => setShowModal(true)}
          />
        ) : null}
      </View>

      <Modal
        accessibilityViewIsModal
        isVisible={showModal}
        useNativeDriver
        customBackdrop={<CustomBackdropModal />}
        style={{ justifyContent: 'flex-start', marginTop: 43 }}
        onSwipeComplete={() => setShowModal(false)}
        swipeDirection='left'
      >
        <View style={styles.cancelModalContent}>
          <View style={styles.wizardModalClose}>
            <TouchableOpacity
              {...accessibility(
                {
                  label: 'Cerrar alerta',
                  hint: 'Volver a detalle de petición',
                  role: 'button'
                },
                { accessible: true }
              )}
              onPress={() => setShowModal(false)}
              style={styles.btnClose}
            >
              <IconClose width={48} height={48} style={styles.iconClose} />
            </TouchableOpacity>
          </View>
          <Text
            {...accessibility(
              {
                label: 'Alerta abierta: Cancelar una petición',
                role: 'text'
              },
              { accessible: true }
            )}
            ref={modalRef}
            style={styles.cancelModalTitle}
          >
            ¡Atención!
          </Text>
          <View>
            <View
              {...accessibility(
                {
                  label: `${user.name}, estás a punto de cancelar una petición de ayuda. ¿Seguro que deseas continuar?`,
                  role: 'text'
                },
                { accessible: true }
              )}
            >
              <Text style={styles.cancelModalParagraph}>
                {`${user.name}, estás a punto de cancelar una petición de ayuda.`}
              </Text>
              <Text style={styles.cancelModalParagraph}>
                ¿Seguro que deseas continuar?
              </Text>
            </View>
            <View style={styles.cancelModalFooter}>
              <View style={styles.buttonItem}>
                <Button
                  {...accessibility(
                    {
                      label: 'No',
                      hint: 'Cerrar alerta y volver a detalle de petición',
                      role: 'button'
                    },
                    { accessible: true }
                  )}
                  text='NO'
                  variant='secondary-modal'
                  onPress={() => setShowModal(false)}
                />
              </View>
              <View style={styles.buttonItem}>
                <Button
                  {...accessibility(
                    {
                      label: 'Si',
                      hint: 'Confirmar cancelación de la petición',
                      role: 'button'
                    },
                    { accessible: true }
                  )}
                  text='SI'
                  variant='negative'
                  onPress={() => {
                    setShowModal(false);
                    navigation.navigate('CollaborationCancel', {
                      collaborationId: collaboration.id,
                      expiredCollaboration
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>


    </ScrollView>
  );
};

const CollaborationDetail: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <RequestDetailInner />
  </Suspense>
);

export default CollaborationDetail;

const buildStyles = ({ theme, constants: { FF, FS, RADIUS } }: BuildStyles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bgSecondary,
      paddingHorizontal: 16
    },
    scrollContent: {
      flexGrow: 1
    },
    wrapper: {
      borderColor: theme.fontColorBase,
      borderRadius: RADIUS.S,
      borderWidth: 2,
      marginBottom: 16,
      overflow: 'hidden'
    },
    wizardModalClose: {},
    header: {
      backgroundColor: theme.primary,
      minHeight: 52,
      paddingHorizontal: 16,
      justifyContent: 'center',
      marginBottom: 16
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
    },
    title: {
      fontSize: FS.L,
      fontFamily: FF.bold,
      color: theme.fontColorNegative
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%'
    },
    volunteer: {
      alignItems: 'center',
      borderBottomColor: theme.divider,
      borderBottomWidth: 2,
      paddingHorizontal: 24,
      width: '100%'
    },
    volunteerPicture: {
      alignSelf: 'center'
    },
    volunteerNameWrapper: {
      alignItems: 'center'
    },
    volunteerPictureBackground: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    volunteerName: {
      fontSize: 25,
      fontFamily: FF.bold
    },
    volunteerCaption: {
      textAlign: 'center',
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FF.M,
      letterSpacing: 0.3,
      paddingBottom: 16
    },
    volunteerFooter: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 28
    },
    info: {
      padding: 16,
      paddingBottom: 4
    },
    infoItem: {
      flexDirection: 'row',
      marginBottom: 10
    },
    infoItemKey: {
      color: theme.fontColorBase,
      fontFamily: FF.semiBold,
      fontSize: FS.M,
      lineHeight: 24,
      flex: 0.35
    },
    infoItemValue: {
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FS.XM,
      lineHeight: 24,
      flex: 0.65
    },
    strongText: {
      fontFamily: FF.bold
    },
    cancelModalContent: {
      borderRadius: RADIUS.L,
      padding: 24,
      backgroundColor: theme.bgAccent
    },
    cancelModalTitle: {
      color: theme.fontColorNegative,
      fontFamily: FF.bold,
      fontSize: FS.XL,
      paddingBottom: 12
    },
    cancelModalParagraph: {
      color: theme.fontColorNegative,
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      paddingBottom: 24
    },
    cancelModalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    buttonItem: {
      width: '48%'
    },
    btnIcon: {
      color: theme.fontColorBase,
      marginTop: 8
    },
    iconClose: {
      color: theme.fontColorNegative,
      marginBottom: 8
    },
    btnClose: {
      marginLeft: 'auto'
    },
    noVolunteerCaption: {
      margin: 20,
      color: theme.fontColorBase,
      fontFamily: FF.regular,
      fontSize: FF.M,
      letterSpacing: 0.3
    }
  });

import { birthPlaces } from 'domain/birthplace';

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  TextInput
} from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import Modal from 'react-native-modal';

import { useAccessibilityAutoFocus } from '@client/common';
import {
  Button,
  Input,
  Select,
  Checkbox,
  Loading,
  CustomBackdropModal
} from '@client/ui-components/src/components';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import {
  RegisterFormModel,
  registerFormValidationSchema,
  registerFormInitialData,
  DocumenType
} from '../domain';

type FormProps = {
  onSubmit: (data: RegisterFormModel) => void;
  isActionDisabled: boolean;
};

const DOCUMENT_TEXTS = {
  1: 'DNI',
  2: 'Pasaporte',
  3: 'NIE o Tarjeta Residencia'
};

const Form = ({ onSubmit, isActionDisabled }: FormProps) => {
  const [birthdayError, setBirthdayError] = useState('');
  const modalRef = useRef<Text>(null);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const { accessibility, focusOnElement, announceForAccessibility } =
    useAccessibilityAutoFocus();
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);

  const formMethods = useForm<RegisterFormModel>({
    resolver: yupResolver(registerFormValidationSchema()),
    defaultValues: registerFormInitialData
  });

  const { control, handleSubmit, errors, setValue, getValues } = formMethods;

  const { theme, role, constants } = useTheme();
  const styles = buildStyles({ role, theme, constants });

  const documentType = useWatch({
    control,
    name: 'documentType',
    defaultValue: 1
  }) as DocumenType;

  useEffect(() => {
    showPrivacyPolicyModal && focusOnElement(modalRef);
  }, [showPrivacyPolicyModal]);

  useEffect(() => {
    isActionDisabled && announceForAccessibility('Registrando');
  }, [isActionDisabled]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorsMessage = Object.values(errors)
        .map((x) => x?.message ?? '')
        .toString();

      announceForAccessibility(
        `Tienes los siguentes errores. ${errorsMessage}`
      );

      setBirthdayError(
        errors.day?.message ??
          errors.month?.message ??
          errors.year?.message ??
          errors.birthday?.message ??
          ''
      );
    }
  }, [errors]);

  return (
    <View style={styles.contentWrapper}>
      <FormProvider {...formMethods}>
        <View style={styles.verticalDivider}>
          <Controller
            name='birthday'
            control={control}
            render={() => (
              <Input
                style={{ opacity: 0, height: 0 }}
                label=''
                placeholder=''
              />
            )}
          />
          <Controller
            name='documentType'
            control={control}
            render={({ onChange, value }) => (
              <Select
                {...accessibility(
                  {
                    label: 'Tipo de documento'
                  },
                  { accessible: true }
                )}
                label='Tipo de documento:'
                value={value}
                onChange={onChange}
              >
                <Picker.Item label='DNI' value={1} />
                <Picker.Item label='Pasaporte' value={2} />
                <Picker.Item label='NIE o Tarjeta Residencia' value={3} />
              </Select>
            )}
          />
        </View>

        <View style={styles.verticalDivider}>
          <Controller
            control={control}
            render={({ onChange, value }) => (
              <Input
                label={DOCUMENT_TEXTS[documentType]}
                placeholder={`Escribe aquí tu ${DOCUMENT_TEXTS[documentType]}`}
                key='document'
                onChangeText={onChange}
                value={value}
                error={errors?.document?.message}
              />
            )}
            name='document'
          />
        </View>

        <View style={styles.verticalDivider}>
          <Controller
            control={control}
            render={({ onChange, value }) => (
              <Input
                label='Nombre de pila'
                placeholder='Escribe aquí tu nombre'
                key='name'
                onChangeText={onChange}
                value={value}
                error={errors?.name?.message}
              />
            )}
            name='name'
          />
        </View>

        <View style={styles.verticalDivider}>
          <Controller
            control={control}
            render={({ onChange, value }) => (
              <Input
                label='Correo electrónico'
                placeholder='Escribe aquí tu correo email'
                key='email'
                keyboardType='email-address'
                onChangeText={onChange}
                value={value}
                error={errors?.email?.message}
              />
            )}
            name='email'
          />
        </View>

        <View style={styles.verticalDivider}>
          <Controller
            control={control}
            render={({ onChange, value }) => (
              <Input
                label='Número de teléfono'
                placeholder='Escribe aquí tu número'
                key='phone'
                keyboardType='phone-pad'
                onChangeText={onChange}
                value={value}
                error={errors?.phone?.message}
              />
            )}
            name='phone'
          />
        </View>

        <View style={styles.verticalDivider}>
          <Controller
            name='birthplace'
            control={control}
            render={({ onChange, value }) => (
              <Select
                {...accessibility(
                  {
                    label: 'Lugar de nacimiento'
                  },
                  { accessible: true }
                )}
                label='Lugar de nacimiento:'
                value={value}
                onChange={onChange}
              >
                {birthPlaces.map(({ id, name }) => (
                  <Picker.Item key={id} label={name} value={id} />
                ))}
              </Select>
            )}
          />
        </View>

        <View>
          <Text
            {...accessibility(
              {
                label: 'Fecha de nacimiento'
              },
              { accessible: true }
            )}
            style={styles.labelBirthday}
          >
            Fecha de nacimiento:
          </Text>
          <View style={styles.birtdayContainer}>
            <View style={styles.inputBirthday}>
              <Controller
                name='day'
                control={control}
                render={({ onChange, value }) => (
                  <Input
                    label='Día'
                    accessibleLabel={false}
                    placeholder='Día'
                    keyboardType={
                      Platform.OS === 'android' ? 'numeric' : 'number-pad'
                    }
                    value={value}
                    onChangeText={(text) => {
                      const { month, year } = getValues();
                      setValue('birthday', `${year}-${month}-${text}`);
                      onChange(text);
                    }}
                    returnKeyType='next'
                    maxLength={2}
                    onSubmitEditing={() => {
                      monthRef.current?.focus();
                    }}
                  />
                )}
              />
            </View>
            <View style={styles.inputBirthday}>
              <Controller
                name='month'
                control={control}
                render={({ onChange, value }) => (
                  <Input
                    ref={monthRef}
                    label='Mes'
                    accessibleLabel={false}
                    placeholder='Mes'
                    keyboardType={
                      Platform.OS === 'android' ? 'numeric' : 'number-pad'
                    }
                    value={value}
                    onChangeText={(text) => {
                      const { day, year } = getValues();
                      setValue('birthday', `${year}-${text}-${day}`);
                      onChange(text);
                    }}
                    returnKeyType='next'
                    maxLength={2}
                    onSubmitEditing={() => {
                      yearRef.current?.focus();
                    }}
                  />
                )}
              />
            </View>
            <View style={styles.inputBirthday}>
              <Controller
                name='year'
                control={control}
                render={({ onChange, value }) => (
                  <Input
                    ref={yearRef}
                    label='Año'
                    accessibleLabel={false}
                    placeholder='Año'
                    keyboardType={
                      Platform.OS === 'android' ? 'numeric' : 'number-pad'
                    }
                    value={value}
                    onChangeText={(text) => {
                      const { day, month } = getValues();
                      setValue('birthday', `${text}-${month}-${day}`);
                      onChange(text);
                    }}
                    returnKeyType='done'
                    maxLength={4}
                  />
                )}
              />
            </View>
          </View>
          <View>
            {birthdayError ? (
              <Text
                {...accessibility(
                  {
                    label: birthdayError
                  },
                  { accessible: true }
                )}
                style={styles.errorText}
              >
                {birthdayError}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.cancelCheck}>
          <View style={styles.cancelCheckbox}>
            <Controller
              control={control}
              name='privacyTermsAccepted'
              render={({ onChange, value }) => (
                <Checkbox
                  {...accessibility(
                    {
                      label: 'Aceptar política de privacidad'
                    },
                    { accessible: true }
                  )}
                  defaultValue={value}
                  onPress={onChange}
                />
              )}
            />
          </View>
          <Text
            {...accessibility(
              {
                label: 'Acepto la política de privacidad',
                hint: 'Ir a política de privacidad',
                role: 'button'
              },
              { accessible: true }
            )}
            style={styles.cancelTextCheck}
            onPress={() => setShowPrivacyPolicyModal(true)}
          >
            Acepto la{' '}
            <Text style={styles.privacyPolicyUnderline}>
              Política de privacidad
            </Text>
          </Text>
        </View>

        <View>
          {errors?.privacyTermsAccepted?.message ? (
            <Text
              {...accessibility(
                {
                  label: errors?.privacyTermsAccepted?.message
                },
                { accessible: true }
              )}
              style={styles.errorText}
            >
              {errors?.privacyTermsAccepted?.message}
            </Text>
          ) : null}
        </View>

        <View style={styles.actionsBar}>
          {isActionDisabled ? (
            <Loading />
          ) : (
            <Button
              {...accessibility(
                { label: 'Registrarse', role: 'button' },
                { accessible: true }
              )}
              text='Registrarse'
              onPress={handleSubmit(onSubmit)}
            />
          )}
        </View>
      </FormProvider>
      <Modal
        accessibilityViewIsModal
        isVisible={showPrivacyPolicyModal}
        useNativeDriver
        customBackdrop={<CustomBackdropModal />}
        style={styles.modal}
      >
        <View style={styles.cancelModalContent}>
          <Text
            {...accessibility(
              { label: 'Política de privacidad' },
              { accessible: true }
            )}
            ref={modalRef}
            style={styles.cancelModalTitle}
          >
            ¡Atención!
          </Text>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.cancelModalParagraph}>
              Los datos recabados serán incorporados y tratados en la actividad
              de tratamiento “Ayudas Voluntarias a Mayores”, responsabilidad de
              la Coordinación General de Familias, Igualdad y Bienestar Social,
              con domicilio en el Paseo de la Chopera 41 (28045 Madrid), correo
              electrónico cgbienestarsocial@madrid.es y teléfono 91 588 89 24
              Los datos se recaban con la finalidad de proporcionar ayuda y
              acompañamiento a mayores a gestiones y actividades, solicitadas a
              través de la APP Madrid Te Acompaña y el Programa Municipal de
              Voluntariado.
            </Text>
            <Text style={styles.cancelModalParagraph}>
              Los datos proporcionados se conservarán con la finalidad descrita
              mientras no se oponga a ello o solicite la cancelación de sus
              datos. Una vez solicitada la cancelación de sus datos, estos serán
              bloqueados durante el plazo de 5 años, a disposición únicamente de
              Administraciones Públicas, Juzgados y Tribunales para atender a
              posibles reclamaciones, tras los cuales, dichos datos serán
              suprimidos. No serán utilizados para elaborar decisiones
              automatizadas respecto a la acción voluntaria.
            </Text>
            <Text style={styles.cancelModalParagraph}>
              Los datos personales tratados por la Coordinación General de
              Familias, Igualdad y Bienestar Social proceden del Padrón
              Municipal de Habitantes.
            </Text>
            <Text style={styles.cancelModalParagraph}>
              Los datos no podrán ser cedidos a terceros, excepto cuando hayan
              sido autorizados por el usuario, o la información sea requerida
              por la autoridad judicial, ministerio fiscal o la policía
              judicial, o la misma venga prevista en la Ley.
            </Text>
            <Text style={styles.cancelModalParagraph}>
              El tratamiento de datos queda legitimado por el interés público.
            </Text>

            <Text style={styles.cancelModalParagraph}>
              Cualquier persona tiene derecho a obtener confirmación sobre si en
              la Coordinación General de Familias, Igualdad y Bienestar Social
              se están tratando datos personales que les conciernan, o no. Las
              personas interesadas tienen derecho a acceder a sus datos
              personales, así como a solicitar la rectificación de los datos
              inexactos o, en su caso, solicitar su supresión cuando, entre
              otros motivos, los datos ya no sean necesarios para los fines que
              fueron recogidos.
            </Text>
            <Text style={styles.cancelModalParagraph}>
              Para ello las solicitudes pueden dirigirse a la Coordinación
              General de Familias, Igualdad y Bienestar Social (con domicilio en
              el Paseo de la Chopera 41, 28045 Madrid, correo electrónico
              cgbienestarsocial@madrid.es).
            </Text>
            <Text style={styles.cancelModalParagraph}>
              En determinadas circunstancias, las personas interesadas podrán
              solicitar la limitación del tratamiento de sus datos, en cuyo caso
              únicamente se conservarán para el ejercicio o la defensa de
              reclamaciones. También por motivos relacionados con su situación
              particular, los interesados podrán oponerse al tratamiento de sus
              datos. El responsable del tratamiento dejará de tratar los datos,
              salvo por motivos legítimos imperiosos, o el ejercicio o la
              defensa de posibles reclamaciones.
            </Text>
            <Text style={styles.cancelModalParagraph}>
              Asimismo, tiene derecho a retirar el consentimiento otorgado, en
              cuyo caso será efectivo desde el momento en el que lo solicite,
              sin tener efectos retroactivos, y derecho, sin tener efectos
              retroactivos, y derecho a reclamar ante la Agencia Española de
              Protección de Datos.
            </Text>
          </ScrollView>
          <View style={styles.cancelModalFooter}>
            <Button
              {...accessibility(
                { label: 'Continuar', hint: 'Cerrar política de privacidad' },
                { accessible: true }
              )}
              text='Continuar'
              variant='secondary-modal'
              onPress={() => setShowPrivacyPolicyModal(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export { Form };

const buildStyles = ({ theme, constants: { RADIUS, FF, FS } }: BuildStyles) =>
  StyleSheet.create({
    contentWrapper: {
      flex: 1,
      paddingBottom: 16,
      paddingTop: 24
    },
    actionsBar: {
      marginTop: 28,
      paddingHorizontal: 16
    },
    verticalDivider: {
      marginBottom: 28
    },
    scroll: {
      flex: 1
    },
    scrollContent: {
      paddingRight: 16
    },
    modal: {
      justifyContent: 'flex-start',
      marginTop: 40,
      marginBottom: 40
    },
    cancelModalContent: {
      borderRadius: RADIUS.L,
      padding: 24,
      backgroundColor: theme.bgAccent,
      flex: 1,
      display: 'flex'
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
      paddingBottom: 24,
      textAlign: 'justify'
    },
    cancelModalFooter: {
      paddingVertical: 24,
      paddingHorizontal: 24,
      justifyContent: 'center'
    },
    cancelCheck: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 16,
      paddingHorizontal: 0
    },
    cancelCheckbox: {
      flex: 0.15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    cancelTextCheck: {
      flex: 0.85,
      color: theme.fontColorBase,
      fontFamily: FF.semiBold,
      fontSize: FS.XM,
      textAlignVertical: 'center',
      letterSpacing: 0.3,
      lineHeight: 45
    },
    errorText: {
      color: theme.error,
      fontFamily: FF.regular,
      fontSize: FF.S,
      paddingHorizontal: 8
    },
    privacyPolicyUnderline: {
      fontStyle: 'italic',
      textDecorationLine: 'underline'
    },
    birtdayContainer: {
      flexDirection: 'row',
      marginBottom: 8
    },
    inputBirthday: {
      marginRight: 10,
      minWidth: 110
    },
    labelBirthday: {
      fontFamily: FF.regular,
      color: theme.fontColorBase,
      fontSize: FS.XM,
      letterSpacing: 0.3,
      lineHeight: 24,
      paddingHorizontal: 8,
      marginBottom: 8
    }
  });

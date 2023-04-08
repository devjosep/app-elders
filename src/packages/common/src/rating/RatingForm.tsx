import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller } from 'react-hook-form';

import { Button } from '@client/ui-components/src/components/Button';
import { Loading } from '@client/ui-components/src/components/Loading';
import { Rating } from '@client/ui-components/src/components/Rating';

import { useAccessibilityAutoFocus } from '../shared/hooks/useAccessibilityAutoFocus';
import { RatingFormModel, ratingFormSchema } from './domain';

type RatingFormProps = {
  align?: 'left' | 'center';
  onSubmit: (data: RatingFormModel) => Promise<void>;
};

const RatingForm = ({ align = 'center', onSubmit }: RatingFormProps) => {
  const { accessibility, announceForAccessibility } =
    useAccessibilityAutoFocus();

  const formMethods = useForm<RatingFormModel>({
    resolver: yupResolver(ratingFormSchema()),
    defaultValues: { rate: null }
  });

  const {
    control,
    handleSubmit,
    errors,
    formState: { isSubmitting, isSubmitted }
  } = formMethods;

  useEffect(() => {
    if (errors.rate?.message) {
      announceForAccessibility(errors.rate.message);
    }
  }, [errors]);

  useEffect(() => {
    isSubmitting && announceForAccessibility('Enviando valoración');
  }, [isSubmitting]);

  useEffect(() => {
    isSubmitted && announceForAccessibility('Valoración enviada');
  }, [isSubmitted]);

  return (
    <View
      style={[align === 'center' ? styles.contentCenter : styles.contentLeft]}
    >
      <Controller
        name='rate'
        control={control}
        defaultValue={null}
        render={({ onChange }) => (
          <Rating
            alignText={align}
            reviews={['Muy mal', 'Mal', 'Normal', 'Bien', 'Muy bien']}
            defaultReview='Valora la colaboración:'
            error={errors?.rate?.message}
            disabled={isSubmitting}
            onPress={(index) => onChange(index)}
          />
        )}
      />
      <View style={styles.actions}>
        {isSubmitting ? (
          <View style={styles.loading}>
            <Loading />
          </View>
        ) : (
          <Button
            style={styles.button}
            {...accessibility(
              {
                label: 'Enviar valoración',
                role: 'button'
              },
              { accessible: true }
            )}
            text='Enviar valoración'
            variant='secondary'
            onPress={handleSubmit(onSubmit)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentLeft: {
    flexShrink: 1,
    alignItems: 'flex-start'
  },
  contentCenter: {
    flex: 1,
    alignItems: 'center'
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8
  },
  button: {
    flex: 1
  },
  loading: {
    height: 50
  }
});

export { RatingForm };

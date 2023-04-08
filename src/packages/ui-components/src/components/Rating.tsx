import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { useAccessibilityAutoFocus } from '@client/common/src/shared/hooks/useAccessibilityAutoFocus';

import { BuildStyles, useTheme } from '../utils';
import { Star } from './rating/Star';

type RatingData = {
  currentRate?: number;
  totalRate: number;
};

interface RatingProps {
  alignText?: 'left' | 'center';
  reviews: string[];
  defaultReview: string;
  defaultRating?: number;
  error?: string;
  disabled?: boolean;
  onPress?: (rating: number) => void;
}

const Rating = ({
  alignText = 'center',
  reviews,
  defaultReview,
  defaultRating,
  error,
  disabled = false,
  onPress
}: RatingProps) => {
  const [rate, setRate] = useState<RatingData>({
    currentRate: defaultRating,
    totalRate: reviews.length
  });

  const { theme, constants } = useTheme();

  const stylesRating = styles({ theme, constants });

  const { accessibility } = useAccessibilityAutoFocus();

  useEffect(() => {
    if (rate?.currentRate !== undefined) {
      onPress?.(rate.currentRate);
    }
  }, [rate]);

  return (
    <>
      <View>
        <Text
          {...accessibility(
            {
              label: rate.currentRate
                ? `Valoración seleccionada: ${reviews[rate.currentRate]}`
                : defaultReview,
              role: 'text'
            },
            { accessible: true }
          )}
          style={[
            stylesRating.reviewText,
            alignText === 'center'
              ? stylesRating.reviewTextCenter
              : stylesRating.reviewTextLeft
          ]}
        >
          {rate.currentRate === undefined
            ? defaultReview
            : reviews[rate.currentRate]}
        </Text>
        <View style={stylesRating.starsWrapper}>
          {reviews.map((review, index) => (
            <TouchableOpacity
              {...accessibility(
                {
                  label: `Valoración: ${review}`,
                  role: 'button',
                  state: {
                    selected:
                      rate.currentRate !== undefined &&
                      index <= rate.currentRate
                  }
                },
                { accessible: true }
              )}
              disabled={disabled}
              activeOpacity={0.7}
              key={index}
              onPress={() => setRate({ ...rate, currentRate: index })}
            >
              <Star
                size={50}
                withFill={
                  rate.currentRate !== undefined && index <= rate.currentRate
                }
                color={theme.rateSelected}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {error ? (
        <Text
          style={stylesRating.errorText}
          lineBreakMode='tail'
          numberOfLines={1}
        >
          {error}
        </Text>
      ) : null}
    </>
  );
};

const styles = ({
  theme,
  constants: { FS, FF }
}: Pick<BuildStyles, 'theme' | 'constants'>) =>
  StyleSheet.create({
    starsWrapper: {
      flexDirection: 'row'
    },
    reviewText: {
      fontFamily: FF.semiBold,
      color: theme.fontColorBase,
      fontSize: FS.L,
      lineHeight: 30
    },
    reviewTextCenter: {
      alignSelf: 'center'
    },
    reviewTextLeft: {
      textAlign: 'left'
    },
    errorText: {
      color: theme.error,
      fontFamily: FF.regular,
      fontSize: FF.S,
      paddingHorizontal: 8,
      paddingTop: 4,
      textAlign: 'right'
    }
  });

export { Rating };

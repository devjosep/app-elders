import * as yup from 'yup';

export type RatingFormModel = {
  rate: number | null;
};

const ratingFormSchema = () =>
  yup
    .object()
    .required()
    .shape({
      rate: yup.number().nullable().required('Introduce una valoración')
    });

export { ratingFormSchema };

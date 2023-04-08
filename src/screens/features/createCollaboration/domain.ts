import * as yup from 'yup';

export type NavigationAction = Readonly<{
  type: string;
  payload?: object | undefined;
  source?: string | undefined;
  target?: string | undefined;
}>;

export type WizardStepProps = {
  goNext?: () => void;
  goPrevious?: () => void;
  setStep?: (step: number) => void;
  goCompany?: () => void;
};

export type CreateCollaborationRequest = {
  serviceCode: number;
  description: string;
  requestDate: Date;
  place: string;
  additionalData: string;
};

const step4ValidationSchema = () =>
  yup
    .object()
    .required()
    .shape({
      direction: yup
        .string()
        .required('El lugar de la cita es obligatorio')
        .min(3, 'El número mínimo de carácteres es 3')
        .max(200, 'El máximo número de carácteres es 200')
        .label('Dirección')
    });

const step5ValidationSchema = () =>
  yup
    .object()
    .required()
    .shape({
      additionalData: yup
        .string()
        .required('La indicación es obligatoria')
        .min(5,"El mínimo número de carácteres es 5")
        .max(200, 'El máximo número de carácteres es 200')
    });

const step5ValidationSchemadigi = () =>
  yup
    .object()
    .required()
    .shape({
      additionalData: yup
        .string()
        .required('El trámite aquí es obligatorio')
        .min(5,"El mínimo número de carácteres es 5")
        .max(200, 'El máximo número de carácteres es 200')
    });
export { step4ValidationSchema, step5ValidationSchema ,step5ValidationSchemadigi};

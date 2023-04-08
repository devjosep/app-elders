import { getSectionHeader } from './shared/Header';
// import Wizard from './Wizard';
import ChooseDistrict from './Wizard/ChooseDistrict';
import ChooseQuarter from './Wizard/ChooseQuarter';
import Confirmation from './Wizard/Confirmation';
import DigitalCompany from './Wizard/DigitalCompany';
import OtherService from './Wizard/OtherService';
import Step3Digital from './Wizard/Step3Digital';

export type RouteParams = {
  Wizard: undefined;
  Confirmation: undefined;
  Collaborations: undefined;
  OtherService: undefined;
  DigitalCompany : undefined;
  ChooseDistrict : undefined;
  ChooseQuarter:undefined;
  Home: undefined;
  Step3Digital: undefined;
};

const StackRoutes = [
  // {
  //   routeName: 'Wizard',
  //   component: Wizard,
  //   header: getSectionHeader(true)
  // },
  {
    routeName: 'Confirmation',
    component: Confirmation,
    header: getSectionHeader(true, 'Confirmación solicitud enviada')
  },
  {
    routeName: 'OtherService',
    component: OtherService,
    header: getSectionHeader(false)
  },
  {
    routeName: 'DigitalCompany',
    component: DigitalCompany,
    header: getSectionHeader(false)
  },
  {
    routeName: 'ChooseDistrict',
    component: ChooseDistrict,
    header: getSectionHeader(false)
  },
  {
    routeName: 'ChooseQuarter',
    component: ChooseQuarter,
    header: getSectionHeader(false)
  },
  {
    routeName: 'Step3Digital',
    component: Step3Digital,
    header: getSectionHeader(false)
  }
];

export { StackRoutes };

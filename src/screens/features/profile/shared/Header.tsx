import React from 'react';

// import { SectionHeader } from '@client/ui-components/src/components';
import { SectionHeader } from '../../../../packages/ui-components/src/components';
// import { Button } from   '@client/';

import ProfileIcon from  '../../../../assets/icons/profile.svg';

const PerfilHeader = () => (
  <SectionHeader section='Perfil' screenName='Perfil' icon={ProfileIcon} />
);

const EditProfileHeader = () => (
  <SectionHeader
    section='Perfil'
    screenName='Editar perfil'
    icon={ProfileIcon}
  />
);

const CameraHeader = () => (
  <SectionHeader section='Cámara' autoFocus={false} icon={ProfileIcon} />
);

const ChangePasswordHeader = () => (
  <SectionHeader
    section='Cambiar contraseña'
    screenName='Cambiar contraseña'
    icon={ProfileIcon}
  />
);

const RemoveProfileHeader = () => (
  <SectionHeader
    section='Eliminar cuenta'
    screenName='Eliminar cuenta'
    icon={ProfileIcon}
  />
);

export {
  PerfilHeader,
  EditProfileHeader,
  ChangePasswordHeader,
  RemoveProfileHeader,
  CameraHeader
};

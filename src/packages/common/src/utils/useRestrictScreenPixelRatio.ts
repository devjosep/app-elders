import { useEffect } from 'react';
import { useWindowDimensions, Alert } from 'react-native';

const useRestrictScreenPixelRatio = (minPixelRatio: number = 2) => {
  const { scale } = useWindowDimensions();

  useEffect(() => {
    if (scale < minPixelRatio) {
      Alert.alert(
        'Resolución de la pantalla',
        'Tiene una resolución de pantalla menor a la recomendada para la correcta visualización de la aplicación. Puede seguir usando la aplicación, pero puede ver algunos defectos visuales. '
      );
    }
  }, []);
};

export { useRestrictScreenPixelRatio };

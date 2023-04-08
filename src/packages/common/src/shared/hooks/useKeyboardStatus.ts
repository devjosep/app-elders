import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardStatus = () => {
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardOpen;
};

export { useKeyboardStatus };

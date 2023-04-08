import { TextInput, Text } from 'react-native';

const configureFontScaling = () => {
  const text = Text as any;
  text.defaultProps = text.defaultProps || {};
  text.defaultProps.maxFontSizeMultiplier = 1;

  const textInput = TextInput as any;
  textInput.defaultProps = textInput.defaultProps || {};
  textInput.defaultProps.maxFontSizeMultiplier = 1;
};

export { configureFontScaling };

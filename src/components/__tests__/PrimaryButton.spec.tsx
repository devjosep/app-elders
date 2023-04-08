import { render } from '@testing-library/react-native';
import faker from 'faker';
import React from 'react';

import { PrimaryButton } from '../PrimaryButton';

describe('Primary Button', () => {
  let text = '';

  beforeEach(() => {
    text = faker.lorem.word();
  });

  test('should be correctly displayed', () => {
    const container = render(<PrimaryButton text={text} />);
    expect(container).toBeDefined();
  });

  test('should display the text passed by props', () => {
    const { getByText } = render(<PrimaryButton text={text} />);
    expect(getByText(text)).toBeDefined();
  });
});

import React, { PropsWithChildren, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';

import { useAccessibilityAutoFocus } from '@client/common';

import { CollapsibleHeader } from './Collapsible/CollapsibleHeader';

type Section = {
  title: string;
  content: React.ReactNode;
};

type CollapsibleProps = {
  title: string;
  headerStyle?: StyleProp<TextStyle>;
};

const Collapsible = ({
  title,
  headerStyle,
  children
}: PropsWithChildren<CollapsibleProps>) => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const {
    accessibility,
    announceForAccessibility
  } = useAccessibilityAutoFocus();

  const sections = [
    {
      title,
      content: children
    }
  ] as Section[];

  return (
    <Accordion
      sections={sections}
      activeSections={activeSections}
      touchableProps={{
        ...accessibility({
          label: 'Filtros',
          hint: 'Ir a filtros'
        })
      }}
      renderHeader={(content, _index, isActive, _sections) => (
        <CollapsibleHeader
          headerStyle={headerStyle}
          title={content.title}
          isActive={isActive}
        />
      )}
      underlayColor='transparent'
      renderContent={() => <>{children}</>}
      onChange={(activeSections) => {
        setActiveSections(activeSections);
        return activeSections.length === 0
          ? announceForAccessibility('colapsado')
          : announceForAccessibility('expandido');
      }}
    />
  );
};

export { Collapsible };

import React, { ComponentType } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

// import { Error } from '../../../components/Error';
import { Error } from '../../../components/Error';

const ErrorBoundaryWrapper = (Component: ComponentType): React.FC<any> => {
  return () => (
    <ErrorBoundary FallbackComponent={Error}>
      <Component />
    </ErrorBoundary>
  );
};

export { ErrorBoundaryWrapper };

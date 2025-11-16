import React from 'react';
import { Alert } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <Alert severity="error">
          <code
            dangerouslySetInnerHTML={{
              __html: error.stack.replaceAll('\n', '<br>').replaceAll(' ', '&nbsp;'),
            }}
          />
        </Alert>
      );
    }
    const { children } = this.props;
    return children;
  }
}

export default ErrorBoundary;

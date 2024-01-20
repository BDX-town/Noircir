import React from 'react';
import { Modal } from '../bits/Modal';
import { AppError } from './AppError';
import { useTranslations, Button } from '@bdxtown/canaille';
import { IconReload } from '@tabler/icons-react';

import fr from './ErrorBoundary.fr-FR.i18n.json';

// eslint-disable-next-line react-refresh/only-export-components
const Error = ({ error } : { error: AppError}) => {
  const { T } = useTranslations('ErrorBoundary', {'fr-FR': fr})

  return (
    <Modal>
      <h3>
        <T>error</T> #{error.code}
      </h3>
      <p>
        { error.userMessage }
      </p>
      <div className='text-right mt-3'>
        <Button size={50} onClick={() => window.location.reload()}>
          <IconReload /> <T>reload</T>
        </Button>
      </div>
    </Modal>
  )
}

export class ErrorBoundary extends React.Component {

    public state: { error: AppError | null };
    public props: { children: React.ReactNode };

    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.props = props;
      this.state = { error: null };
    }
  
    static getDerivedStateFromError(error: Error) {
      // Update state so the next render will show the fallback UI.
      return { error };
    }

    onPromiseRejection = (event: PromiseRejectionEvent) => {
        this.setState({ error: event.reason })
    }
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidCatch(error: Error, info: { componentStack: string }) {
        // TODO: do something with error 
    }

    componentDidMount() {
        // Add an event listener to the window to catch unhandled promise rejections & stash the error in the state
        window.addEventListener('unhandledrejection', this.onPromiseRejection)
    }

    componentWillUnmount() {
        window.removeEventListener('unhandledrejection', this.onPromiseRejection);
    }

  
    render() {
      return (
        <>
          { this.state.error && <Error error={this.state.error} />}
          { this.props.children }
        </>
      );
    }
  }
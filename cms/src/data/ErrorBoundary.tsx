import React from 'react';

export class ErrorBoundary extends React.Component {

    public state: { error: Error | null };
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
      if (this.state.error) {
        // TODO: decide what to do with error
        return <code>{ JSON.stringify(this.state.error) }</code>
      }
  
      return this.props.children;
    }
  }
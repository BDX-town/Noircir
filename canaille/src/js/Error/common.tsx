import React from 'react';

import { ICommonProps } from '../types/ICommonProps';
import { createUseStyles } from '../helpers/createUseStyles';

const useStyle = createUseStyles({
  error: {
    display: 'block',
    fontSize: 'var(--text-50)',
    color: 'var(--alert-100)',
    fontStyle: 'normal',
    marginTop: 'var(--spacing-1)',
    paddingLeft: 'var(--spacing-25)',
    textAlign: 'left',
    fontWeight: '400',
  },
});

interface IError extends ICommonProps {
  children: React.ReactNode;
}

const Error = React.forwardRef(
  ({
    className = '', id, style, testId, children, ...rest
  }: IError, ref) => {
    const { error } = useStyle();
    // https://www.w3.org/WAI/GL/wiki/Using_ARIA_role_of_alert_for_Error_Feedback_in_Forms
    return (
      <span
        {...rest}
        id={id}
        role="alert"
        className={`${error} ${className}`}
        style={style}
        data-testid={testId}
        ref={ref as never}
      >
        {children}
      </span>
    );
  },
);

Error.displayName = 'Error';

export { Error };

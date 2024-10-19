import React from 'react';

/**
 * Every Canaille component must support those parameters
 */
export interface ICommonProps {
  /**
   * React ref property
   */
  ref?: React.Ref<HTMLElement>;
  /**
   * Optional css classes to add to the component
   */
  className?: string;
  /**
   * Optional component DOM ID
   */
  id?: string;
  /**
   * Optional testId
   */
  testId?: string;
  /**
   * Optional style
   */
  style?: React.CSSProperties;
}

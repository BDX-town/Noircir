export interface IFormProps {
  /**
   * True if component is readonly
   */
  readonly?: boolean;
  /**
   * Name used to identify the input in a form onSubmit event
   */
  name?: string;
  /**
   * Called on change
   * @param e onChange event
   * @returns void
   */
  onChange?: (e: React.ChangeEvent) => void;
  /**
   * Value in controlled mode
   */
  value?: string | number | string[] | undefined;
  /**
   * Initial value in uncontrolled mode
   */
  defaultValue?: string | number | string[] | undefined;
  /**
   * True if disabled
   */
  disabled?: boolean;
  /**
   * True if required
   */
  required?: boolean;
  /**
   * Call validation system on each change
   */
  validateOnChange?: boolean;
  /**
   * Custom function to apply specific validity checks
   * @param currentValue Input's current value
   * @returns A localized string describing the error or undefined in everything is fine
   */
  checkValidity?: (currentValue: unknown) => string | undefined;
  /**
   * Called when invalid
   * @param e Invalid event
   * @returns nulll
   */
  onInvalid?: React.FormEventHandler<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
}

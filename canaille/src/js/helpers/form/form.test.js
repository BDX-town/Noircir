import React from 'react';
import {
  findByText,
  fireEvent,
  getAllByRole,
  getByRole,
  getByTestId,
  getByText,
  render,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import translate from 'counterpart';
import { container } from 'webpack';
import { TranslationContext, useValidation } from '../../../../dist/goodmed';

import us from './form.en-US.i18n.json';

const HELLO = 'Hello';
const ERROR = 'Not Hello';

function DummyCmpSimpleInput({ onSubmit }) {
  const inp = React.useRef();

  const checkValidity = React.useCallback(
    (val) => (val !== HELLO ? ERROR : undefined),
    [],
  );
  const { error, onInvalid, onInput } = useValidation({
    root: inp,
    checkValidity,
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={inp}
        type="text"
        required
        onInvalid={onInvalid}
        onInput={onInput}
      />
      {error && <span>{error}</span>}
      <button type="submit">submit</button>
    </form>
  );
}

function DummyCmpMultipleInput({ onSubmit }) {
  const inp = React.useRef();

  const checkValidity = React.useCallback(
    (val) => (val !== '1' ? ERROR : undefined),
    [],
  );
  const { error, onInvalid, onInput } = useValidation({
    root: inp,
    checkValidity,
  });

  return (
    <form onSubmit={onSubmit}>
      <fieldset ref={inp} onInvalid={onInvalid}>
        <input type="radio" onInput={onInput} name={HELLO} required value={1} />
        <input type="radio" onInput={onInput} name={HELLO} required value={2} />
        <input type="radio" name={HELLO} onInput={onInput} required value={3} />
      </fieldset>
      {error && <span role="alert">{error}</span>}
      <button type="submit">submit</button>
    </form>
  );
}

function DummyCmpSelectInput({ onSubmit }) {
  const inp = React.useRef();

  const checkValidity = React.useCallback(
    (val) => (val !== HELLO ? ERROR : undefined),
    [],
  );
  const { error, onInvalid, onInput } = useValidation({
    root: inp,
    checkValidity,
  });

  return (
    <form onSubmit={onSubmit}>
      <select ref={inp} required onInvalid={onInvalid} onInput={onInput}>
        <option value="">-- select --</option>
        <option value={HELLO}>{HELLO}</option>
        <option value={ERROR}>2</option>
        <option value={3}>3</option>
      </select>
      {error && <span role="alert">{error}</span>}
      <button type="submit">submit</button>
    </form>
  );
}

function checkNativeRequired(Cmp, role, action) {
  return async () => {
    const onSubmit = jest.fn((e) => {
      e.preventDefault();
    });
    const { container } = render(
      <TranslationContext __={translate} defaultLang="en-US">
        <Cmp onSubmit={onSubmit} />
      </TranslationContext>,
    );
    const submit = getByRole(container, 'button');
    const input = getAllByRole(container, role)[0];

    fireEvent.click(submit);
    await findByText(container, us.useValidation.error.valueMissing);
    expect(onSubmit).toHaveBeenCalledTimes(0);

    // following the input type we may need to click or input text
    await action(input);

    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  };
}

test(
  'Validation system: native required check simple input',
  checkNativeRequired(DummyCmpSimpleInput, 'textbox', (input) => userEvent.type(input, HELLO)),
);
test(
  'Validation system: native required check complexe input',
  checkNativeRequired(DummyCmpMultipleInput, 'radio', (input) => userEvent.click(input)),
);
test(
  'Validation system: native required check select input',
  checkNativeRequired(DummyCmpSelectInput, 'combobox', (input) => userEvent.selectOptions(input, HELLO)),
);

function checkCustomValidity(Cmp, wrong, right) {
  return async () => {
    const onSubmit = jest.fn((e) => {
      e.preventDefault();
    });
    const { container } = render(
      <TranslationContext __={translate} defaultLang="en-US">
        <Cmp onSubmit={onSubmit} />
      </TranslationContext>,
    );
    const submit = getByRole(container, 'button');

    await wrong(container);

    fireEvent.click(submit);
    await findByText(container, ERROR);
    expect(onSubmit).toHaveBeenCalledTimes(0);

    // following the input type we may need to click or input text
    await right(container);

    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  };
}

test(
  'Validation system: custom validity check simple input',
  checkCustomValidity(
    DummyCmpSimpleInput,
    (container) => userEvent.type(getByRole(container, 'textbox'), ERROR),
    async (container) => {
      await userEvent.clear(getByRole(container, 'textbox'));
      return userEvent.type(getByRole(container, 'textbox'), HELLO);
    },
  ),
);
test(
  'Validation system: custom validity check complexe input',
  checkCustomValidity(
    DummyCmpMultipleInput,
    (container) => userEvent.click(getAllByRole(container, 'radio')[1]),
    (container) => userEvent.click(getAllByRole(container, 'radio')[0]),
  ),
);
test(
  'Validation system: custom validity check select input',
  checkCustomValidity(
    DummyCmpSelectInput,
    (container) => userEvent.selectOptions(getByRole(container, 'combobox'), ERROR),
    (container) => userEvent.selectOptions(getByRole(container, 'combobox'), HELLO),
  ),
);

function checkSubmit(Cmp, action) {
  return async () => {
    const onSubmit = jest.fn((e) => {
      e.preventDefault();
    });
    const { container } = render(
      <TranslationContext __={translate} defaultLang="en-US">
        <Cmp onSubmit={onSubmit} />
      </TranslationContext>,
    );

    await action(container);

    const submit = getByText(container, 'submit');
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  };
}

test(
  'Validation system: submit simple input',
  checkSubmit(DummyCmpSimpleInput, (container) => userEvent.type(getByRole(container, 'textbox'), HELLO)),
);
test(
  'Validation system: submit complexe input',
  checkSubmit(DummyCmpMultipleInput, (container) => userEvent.click(getAllByRole(container, 'radio')[0])),
);
test(
  'Validation system: submit select input',
  checkSubmit(DummyCmpSelectInput, (container) => userEvent.selectOptions(getByRole(container, 'combobox'), HELLO)),
);

function DirtyCmpSimpleInput() {
  const inp = React.useRef();
  const { onInvalid, onInput } = useValidation({ root: inp });
  return (
    <input
      ref={inp}
      type="text"
      defaultValue={HELLO}
      onInvalid={onInvalid}
      onInput={onInput}
    />
  );
}

function DirtyCmpMultipleInput() {
  const inp = React.useRef();
  const { onInvalid, onInput } = useValidation({ root: inp });
  return (
    <fieldset ref={inp} onInvalid={onInvalid}>
      <input
        type="radio"
        onInput={onInput}
        name={HELLO}
        defaultChecked
        required
        value={1}
      />
      <input type="radio" onInput={onInput} name={HELLO} value={2} />
      <input type="radio" onInput={onInput} name={HELLO} value={3} />
    </fieldset>
  );
}

function DirtyCmpSelectInput() {
  const inp = React.useRef();

  const { onInvalid, onInput } = useValidation({ root: inp });

  return (
    <select
      ref={inp}
      required
      onInvalid={onInvalid}
      onInput={onInput}
      defaultValue={HELLO}
    >
      <option value="">-- select --</option>
      <option value={HELLO}>{HELLO}</option>
      <option value={ERROR}>2</option>
      <option value={3}>3</option>
    </select>
  );
}

function checkDirty(Cmp, dirty, clean) {
  return async () => {
    const onSubmit = jest.fn((e) => {
      e.preventDefault();
    });
    const { container } = render(
      <div>
        <Cmp onSubmit={onSubmit} />
      </div>,
    );
    await dirty(container);
    expect(container.querySelector("[data-dirty='true']")).toBeTruthy();
    await clean(container);
    expect(container.querySelector("[data-dirty='true']")).toBeFalsy();
    expect(container.querySelector("[data-dirty='false']")).toBeTruthy();
  };
}

test(
  'Validation system: dirty simple input',
  checkDirty(
    DirtyCmpSimpleInput,
    (container) => userEvent.type(getByRole(container, 'textbox'), ERROR),
    async (container) => {
      await userEvent.clear(getByRole(container, 'textbox'));
      return userEvent.type(getByRole(container, 'textbox'), HELLO);
    },
  ),
);
test(
  'Validation system: dirty complexe input',
  checkDirty(
    DirtyCmpMultipleInput,
    (container) => userEvent.click(getAllByRole(container, 'radio')[1]),
    (container) => userEvent.click(getAllByRole(container, 'radio')[0]),
  ),
);
test(
  'Validation system: submit select input',
  checkDirty(
    DirtyCmpSelectInput,
    (container) => userEvent.selectOptions(getByRole(container, 'combobox'), ERROR),
    (container) => userEvent.selectOptions(getByRole(container, 'combobox'), HELLO),
  ),
);

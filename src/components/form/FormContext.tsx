import * as React from 'react';
import type { ValidateMessages, Store, FieldData, FormInstance } from './interface';

export type Forms = Record<string, FormInstance>;

export interface FormChangeInfo {
  changedFields: FieldData[];
  forms: Forms;
}

export interface FormFinishInfo {
  values: Store;
  forms: Forms;
}

export interface FormProviderProps {
  validateMessages?: ValidateMessages;
  onFormChange?: (name: string, info: FormChangeInfo) => void;
  onFormFinish?: (name: string, info: FormFinishInfo) => void;
  children?: React.ReactNode;
}

export interface FormContextProps extends FormProviderProps {
  triggerFormChange: (name: string, changedFields: FieldData[]) => void;
  triggerFormFinish: (name: string, values: Store) => void;
  registerForm: (name: string, form: FormInstance) => void;
  unregisterForm: (name: string) => void;
}

const FormContext = React.createContext<FormContextProps>({
  triggerFormChange: () => {},
  triggerFormFinish: () => {},
  registerForm: () => {},
  unregisterForm: () => {},
});

const FormProvider: React.FunctionComponent<FormProviderProps> = ({
  validateMessages,
  onFormChange,
  onFormFinish,
  children,
}) => {
  const formContext = React.useContext(FormContext);

  const formsRef = React.useRef<Forms>({});

  const triggerFormChange = (name: string, changedFields: FieldData[]) => {
    onFormChange?.(name, { changedFields, forms: formsRef.current });

    formContext.triggerFormChange(name, changedFields);
  };

  const triggerFormFinish = (name: string, values: Store) => {
    onFormFinish?.(name, { values, forms: formsRef.current });

    formContext.triggerFormFinish(name, values);
  };

  const registerForm = (name: string, form: FormInstance) => {
    if (name) {
      formsRef.current = {
        ...formsRef.current,
        [name]: form,
      };
    }

    formContext.registerForm(name, form);
  };

  const unregisterForm = (name: string) => {
    const forms = { ...formsRef.current };
    delete forms[name];
    formsRef.current = forms;

    formContext.unregisterForm(name);
  };

  return (
    <FormContext.Provider
      value={{
        ...formContext,
        validateMessages: {
          ...formContext.validateMessages,
          ...validateMessages,
        },
        triggerFormChange,
        triggerFormFinish,
        registerForm,
        unregisterForm
      }}>
      {children}
    </FormContext.Provider>
  );
};

export { FormProvider };

export default FormContext;

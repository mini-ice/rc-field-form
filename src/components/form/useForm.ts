import * as React from 'react';
import type {
  Callbacks,
  FieldEntity,
  FieldError,
  FormInstance,
  Meta,
  NamePath,
  Store,
  ValidateMessages,
} from './interface';
import { get } from 'lodash-es';

export class FormStore {
  private forceRootUpdate: () => void;

  private subscribable: boolean = true;

  private store: Store = {};

  private fieldEntities: FieldEntity[] = [];

  private initialValues: Store = {};

  private callbacks: Callbacks = {};

  private ValidateMessages: ValidateMessages | null = null;

  private preserve?: boolean | null = null;

  private lastValidatePromise: Promise<FieldError[]> | null = null;

  constructor(forceRootUpdate: () => void) {
    this.forceRootUpdate = forceRootUpdate;
  }

  getForm() {
    return {
      getFieldValue: this.getFieldValue,
    } as any;
  }

  private getFieldValue = (name: NamePath) => {
    const namePath = Array.isArray(name) ? name : [name];
    return get(this.store, namePath);
  };

  private getFieldsValue = (nameList?: NamePath[] | true, filterFunc?: (meta: Meta) => boolean) => {
    if (nameList === true && !filterFunc) {
      return this.store;
    }

    // ...
  };

  private getFieldError = () => {};
  private getFieldsError = () => {};

  private getFieldWarning = () => {};

  private isFieldTouched = () => {};
  private isFieldsTouched = () => {};

  private isFieldValidating = () => {};
  private isFieldsValidating = () => {};

  private resetFields = () => {};

  private setFields = () => {};
  private setFieldValue = () => {};
  private setFieldsValue = () => {};

  private validateFields = () => {};
  private submit = () => {};

  getInternalHooks = () => {};
}

function useForm<Values = any>(form?: FormInstance<Values>): [FormInstance<Values>] {
  const formRef = React.useRef<FormInstance>();

  const [, forceUpdate] = React.useState({});

  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const forceReRender = () => forceUpdate({});

      const formStore: FormStore = new FormStore(forceReRender);
      formRef.current = formStore.getForm();
    }
  }

  return [formRef.current!];
}

export default useForm;

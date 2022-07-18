
export type InternalNamePath = (string | number)[];
export type NamePath = string | number | InternalNamePath;

export type StoreValue = any;
export type Store = Record<string, StoreValue>;

export interface Meta {
  name: InternalNamePath;
  touched: boolean;
  errors: string[];
  warnings: string[];
  validating: boolean;
}

export interface InternalFieldData extends Meta {
  value: StoreValue;
}

export interface FieldData extends Partial<Omit<InternalFieldData, 'name'>> {
  name: NamePath;
}

export interface FieldError {
  name: InternalNamePath;
  errors: string[];
  warning: boolean;
}

export type ValidateFields<Values = any> = (nameList?: NamePath[]) => Promise<Values>;

export interface Callbacks<Values = any> {
  onValuesChange?: (changeValues: any, values: Values) => void;
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
  onFinish?: (values: Values) => void;
  onFinishFailed?: (errorInfo: any) => void;
}

type RecursivePartial<T> = T extends Record<string, any>
  ? {
      [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends Record<string, any>
        ? RecursivePartial<T[P]>
        : T[P];
    }
  : any;

export interface FormInstance<Values = any> {
  getFieldValue: (name: NamePath) => any;
  getFieldsValue: (() => Values) & ((nameList: NamePath[] | true, filterFunc?: (meta: any) => boolean) => any);

  getFieldError: (name: NamePath) => string[];
  getFieldsError: (nameList: NamePath[]) => FieldError[];

  getFieldWarning: (name: NamePath) => string[];

  isFieldTouched: (name: NamePath) => boolean;
  isFieldsTouched: ((nameList: NamePath[], allFieldsTouched?: boolean) => boolean) &
    ((allFieldTouched: boolean) => boolean);

  isFieldValidating: (name: NamePath) => boolean;
  isFieldsValidating: (nameList: NamePath[]) => boolean;

  setFields: (values: FieldData[]) => void;
  setFieldValue: (name: NamePath, value: any) => void;
  setFieldsValue: (values: RecursivePartial<Values>) => void;

  validateFields: ValidateFields<Values>;

  submit: () => void;
}

type ValidateMessage = string | (() => string);
export interface ValidateMessages {
  default?: ValidateMessage;
  required?: ValidateMessage;
  enum?: ValidateMessage;
  whitespace?: ValidateMessage;
  date?: {
    format?: ValidateMessage;
    parse?: ValidateMessage;
    invalid?: ValidateMessage;
  };
  types?: {
    string?: ValidateMessage;
    method?: ValidateMessage;
    array?: ValidateMessage;
    object?: ValidateMessage;
    number?: ValidateMessage;
    date?: ValidateMessage;
    boolean?: ValidateMessage;
    integer?: ValidateMessage;
    float?: ValidateMessage;
    regexp?: ValidateMessage;
    email?: ValidateMessage;
    url?: ValidateMessage;
    hex?: ValidateMessage;
  };
  string?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  number?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  array?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  pattern?: {
    mismatch?: ValidateMessage;
  };
}

export interface ValidateErrorEntity<Values = any> {
  values: Values;
  errorFields: { name: InternalNamePath; errors: string[] };
  outOfDate: boolean;
}

export type ValueUpdateInfo = {
  type: 'valueUpdate';
  source: 'internal' | 'external';
};

export type ValidateFinishInfo = {
  type: 'validateFinish';
};

export type ResetInfo = {
  type: 'reset';
};

export type RemoveInfo = {
  type: 'remove';
};

export type SetFieldInfo = {
  type: 'setField';
  data: FieldData;
};

export type DependenciesUpdateInfo = {
  type: 'dependenciesUpdate';
  relateFields: InternalNamePath[];
};

export type NotifyInfo =
  | ValueUpdateInfo
  | ValidateFinishInfo
  | ResetInfo
  | RemoveInfo
  | SetFieldInfo
  | DependenciesUpdateInfo;

export type ValuedNotifyInfo = NotifyInfo  & {
  store: Store
}

export interface FieldEntity {
  onStoreChange: (store: Store, namePathList: InternalNamePath[] | null, info: ValuedNotifyInfo) => void;
  isFieldTouched: () => boolean;
  isFieldDirty: () => boolean;
  isFieldValidating: () => boolean;
  isListField: () => boolean;
  isList: () => boolean;
  isPerserve: () => boolean;
  // validateRules: (options: ValidateOptions) => Promise<RuleError[]>;
  getMeta: () => Meta;
  getNamePath: () => InternalNamePath;
  getErrors: () => string[];
  getWarnings: () => string[];
  props: {
    name?: NamePath;
    // rules?: Rule[];
    dependencies?: NamePath[];
    initialValues?: any;
  }
}

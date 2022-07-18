import * as React from 'react';
import FormContext, { FormContextProps } from './FormContext';
import type { Store, FormInstance, ValidateMessages, FieldData, Callbacks } from './interface';
import useForm from './useForm';

type BaseFormProps = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'>;
type RenderProps = (values: any, form: any) => JSX.Element | React.ReactNode;

export interface FormProps<Values = any> extends BaseFormProps {
  initialValues?: Store;
  form?: FormInstance<Values>;
  children?: RenderProps | React.ReactNode;
  component?: false | string | React.FC<any> | React.ComponentClass<any>;
  fields?: FieldData[];
  name: string;
  validateMessages?: ValidateMessages;
  onValueChange?: Callbacks['onValuesChange'];
  onFieldsChange?: Callbacks['onFieldsChange'];
  onFinish?: Callbacks['onFinish'];
  onFinishFailed?: Callbacks['onFinishFailed'];
  validateTrigger?: string | string[] | false;
  preserve?: boolean;
}

const Form: React.ForwardRefRenderFunction<FormInstance, FormProps> = (
  {
    name,
    initialValues,
    fields,
    form,
    preserve,
    children,
    component: Component = 'form',
    validateMessages,
    validateTrigger = 'onChange',
    onValueChange,
    onFieldsChange,
    onFinish,
    onFinishFailed,
    ...restProps
  }: FormProps,
  ref
) => {
  const formContext: FormContextProps = React.useContext(FormContext);

  const [formInstance] = useForm(form);

  React.useImperativeHandle(ref, () => formInstance);

  React.useEffect(() => {
    formContext.registerForm(name ?? '', formInstance);
    return () => formContext.unregisterForm(name ?? '');
  }, [formContext, formInstance, name]);

  if(Component === false) {
    return null;
  }

  return <Component {...restProps}>Form</Component>;
};

export default React.forwardRef(Form);

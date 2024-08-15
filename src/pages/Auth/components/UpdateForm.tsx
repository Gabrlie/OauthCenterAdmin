import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-components';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.clientListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.clientListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      title= '编辑'
      width={640}
      visible={props.updateModalOpen}
      
      open={props.updateModalOpen}
      onFinish={props.onSubmit}
      initialValues={{
        name: props.values.name,
        redirect: props.values.redirect,
      }}
    >
      <ProFormText
        name="name"
        label='应用名称'
        width="md"
        rules={[
          {
            required: true,
            message: "请输入应用名称！",
          },
        ]}
      />
      <ProFormText
        name="redirect"
        label='重定向地址'
        width="md"
        rules={[
          {
            required: true,
            message: "请输入重定向地址！",
          },
        ]}
      />
    </ModalForm>
  );
};

export default UpdateForm;

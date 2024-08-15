import React, {forwardRef, MutableRefObject, useImperativeHandle, useState} from "react";
import {ActionType, ModalForm, ProFormRadio, ProFormText} from "@ant-design/pro-components";
import {message} from "antd";
import {ProFormSegmented} from "@ant-design/pro-form/lib";
import {useAccess} from "umi";
import {checkClientUpdate} from "@/services/ant-design-pro/api";

type DataType = {
  id: string
  name: string
  notes: string
  redirect: string
  checked: number
}

const UpdateModal = forwardRef((props, ref) => {
  const [isVisible, setVisible] = useState(false)
  const [actionRef, setActionRef] = useState<MutableRefObject<ActionType>>()
  const [data, setData] = useState<DataType>();
  const access = useAccess();

  useImperativeHandle(ref, () => (
    {
      show: (actionRef: MutableRefObject<ActionType>, data: DataType) => {
        setVisible(true)
        setActionRef(actionRef)
        setData(data)
      }
    }
  ))

  return (
    <ModalForm
      title="编辑客户端"
      open={isVisible}
      width={500}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setVisible(false),
      }}
      onFinish={async (values) => {
        const updatedValue = { ...values, id: data?.id };
        checkClientUpdate(updatedValue).then(() => {
          message.success('提交成功');
          actionRef.current.reload();
        }).catch(e => {
          message.error('提交失败');
        })
        setVisible(false)
        return true;
      }}
    >
      {
        access.isAdmin && (
          <ProFormRadio.Group
            name="checked"
            label="审核状态"
            radioType="button"
            disabled={data?.checked !== 0}
            options={[
              {
                label: '审核中',
                value: 0,
              },
              {
                label: '审核通过',
                value: 1,
              },
              {
                label: '审核不通过',
                value: 2,
              },
            ]}
            initialValue={data?.checked}
          />
        )
      }
      {data?.name &&(
        <ProFormText
          label="应用名称"
          disabled={data?.checked !== 0}
          rules={[
            {
              required: true,
              message: "名称是必填项",
            },
          ]}
          width="md"
          name="name"
          initialValue={data?.name}
        />
      )}
      {data?.redirect && (
        <ProFormText
          label="回调地址"
          disabled={data?.checked !== 0}
          rules={[
            {
              required: true,
              message: "回调地址是必填项",
            },
            {
              type: 'url',
              message: "请输入有效的 URL 地址",
            },
          ]}
          width="md"
          name="redirect"
          initialValue={data?.redirect}
        />
      )}
      <ProFormText
        label="备注"
        width="md"
        name="notes"
        initialValue={data?.notes}
        disabled={data?.checked !== 0}
      />
    </ModalForm>
  )
})

export default UpdateModal;

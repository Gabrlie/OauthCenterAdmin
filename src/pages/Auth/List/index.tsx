import { clientCreate, clientDelete, clientList, clientUpdate } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import { useAccess } from 'umi';

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.clientListItem) => {
  const hide = message.loading('正在更新');
  try {
    await clientUpdate({ ... fields, id: fields.id });
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.clientListItem[]) => {
  console.log(selectedRows);

  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await clientDelete({
      id: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.clientListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.clientListItem[]>([]);
  const access = useAccess();

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.clientListItem) => {
    const hide = message.loading('正在添加');
    try {
      await clientCreate({ ...fields });
      hide();
      if (access.isAdmin) {
        message.success('添加成功');
      } else {
        message.success('添加成功，等待管理员审核');
      }

      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };

  const columns: ProColumns<API.clientListItem>[] = [
    {
      title: '客户端ID',
      dataIndex: 'id',
      copyable: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '客户端密钥',
      dataIndex: 'secret',
      copyable: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '客户端名称',
      dataIndex: 'name',
    },
    {
      title: '创建者',
      dataIndex: 'created_by',
    },
    {
      title: '重定向URI',
      dataIndex: 'redirect',
    },
    {
      title: '备注',
      dataIndex: 'notes',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record); // 设置当前行数据
            handleUpdateModalOpen(true); // 打开更新表单
            // 输出当前行数据
            console.log(currentRow);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </a>
      ],
    },
  ];

  return (
    <PageContainer>
      {/* 列表渲染 */}
      <ProTable<API.clientListItem, API.PageParams>
        headerTitle='查询表格'
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={clientList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {/* 批量操作 */}
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      {/* 新建 */}
      <ModalForm
        title="新建"
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.clientListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label="应用名称"
          rules={[
            {
              required: true,
              message: "名称是必填项",
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormText
          label="回调地址"
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
        />
        <ProFormText
          label="备注"
          width="md"
          name="notes"
        />
      </ModalForm>
      {/* 更新 */}
      <ModalForm
        key={currentRow?.id}
        title="更新"
        width="400px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async (value) => {
          const updatedValue = { ...value, id: currentRow?.id };
          const success = await handleUpdate(updatedValue);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        {currentRow?.name &&(
          <ProFormText
            label="应用名称"
            rules={[
              {
                required: true,
                message: "名称是必填项",
              },
            ]}
            width="md"
            name="name"
            initialValue={currentRow?.name}
          />
        )}
        {currentRow?.redirect && (
          <ProFormText
            label="回调地址"
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
            initialValue={currentRow?.redirect}
          />
        )}
        <ProFormText
          label="备注"
          width="md"
          name="notes"
          initialValue={currentRow?.notes}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;

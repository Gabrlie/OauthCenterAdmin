import {ActionType, PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {checkClientList} from "@/services/ant-design-pro/api";
import {useAccess} from "umi";
import {useRef} from "react";
import UpdateModal from "@/pages/CheckClient/UpdateModal";

const List = () => {
  const actionRef = useRef<ActionType>();
  const modalRef = useRef();

  const openModal = (data: any) => {
    modalRef.current?.show(actionRef, data);
  }

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      title: '序号',
      valueType: 'indexBorder',
      search: false,
    },
    {
      dataIndex: 'created_by',
      title: '创建者',
    },
    {
      dataIndex: 'name',
      title: '客户端名称',
    },
    {
      dataIndex: 'redirect',
      title: '重定向地址',
    },
    {
      dataIndex: 'notes',
      title: '备注',
      search: false,
    },
    {
      dataIndex: 'checked',
      title: '审核状态',
      renderText: (text: any) => text === 1 ? '审核通过' : text === 2 ? '审核未通过' : '未审核',
    },
    {
      dataIndex: 'created_at',
      title: '创建时间',
      search: false,
    },
    {
      dataIndex: 'updated_at',
      title: '更新时间',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_,data) => [
          <a key='edit' onClick={() => openModal(data)}>编辑</a>
      ],
    }
  ]

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={checkClientList}
        actionRef={actionRef}
      />
      <UpdateModal ref={modalRef} />
    </PageContainer>
  )
}

export default List;

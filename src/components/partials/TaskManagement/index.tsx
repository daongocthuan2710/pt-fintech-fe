'use-client';

import { Table, Button, Select, DatePicker, notification, Space, Tag, Modal, Flex } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import isEqual from 'react-fast-compare';
import { useCreateTask, useGetTaskList, useUpdateTask } from '@/queries/Task';
import { TTask } from '@/models/Task';
import { ColumnsType } from 'antd/es/table';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui';

const { Option } = Select;
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const TASK_STATUS = {
  TODO: {
    key: 'to-do',
    label: 'To Do',
    color: 'default',
  },
  IN_PROCESS: {
    key: 'in-process',
    label: 'In Process',
    color: 'blue',
  },
  COMPLETED: {
    key: 'completed',
    label: 'Completed',
    color: 'green',
  },
};

interface TState {
  tasks?: TTask[];
  filterField?: string;
  filterValues?: string[];
  sort?: string;
  az?: string;
  openCreateTask: boolean;
  openUpdateTask: boolean;
  taskDetailInfo?: TTask;
  modalLoading: boolean;
  searchTitle: string;
}

const INITIAL_STATE: TState = {
  tasks: [],
  openCreateTask: false,
  openUpdateTask: false,
  modalLoading: false,
  searchTitle: '',
};

export const TaskListing: React.FC = memo(() => {
  const { data } = useSession();
  const { user } = data || {};
  const { id: userId = '' } = user || {};

  const [state, setState] = useState(INITIAL_STATE);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description?: string,
  ) => {
    api[type]({
      message,
      description: description || '',
    });
  };

  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const {
    data: taskList = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetTaskList<TTask[]>({
    params: {
      filterField: state.filterField || '',
      filterValues: state.filterValues || [],
      sort: state.sort || '',
      az: state.az || '',
      searchTitle: state.searchTitle,
    },
  });

  useEffect(() => {
    if (!isEqual(taskList, state.tasks)) {
      setState((prev) => ({ ...prev, tasks: taskList }));
    }
    return () => {};
  }, [taskList, state.tasks]);

  const onSelectTask = (task: TTask) => {
    setState((prev) => ({ ...prev, openUpdateTask: true, taskDetailInfo: task }));
  };

  const columns: ColumnsType<TTask> = [
    {
      title: 'Title',
      dataIndex: 'title',
      //   sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: Object.values(TASK_STATUS)?.map(({ key, label, color }) => ({
        text: <span style={{ color }}>{label}</span>,
        value: key,
      })),
      render(value) {
        const status = Object.values(TASK_STATUS)?.find((item) => item.key === value);
        return <Tag color={status?.color || 'default'}>{status?.label || ''}</Tag>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: true,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onSelectTask(record)}>Edit</Button>
          <Button type="primary" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleSaveTask = async (task) => {
    setState((prev) => ({ ...prev, modalLoading: true }));
    if (!!userId) {
      const customTask: TTask = {
        ...task,
        userId,
        dueDate: dayjs(task?.dueDate).valueOf(),
      };

      const result: any = await (state.openCreateTask
        ? createTask(customTask)
        : state.openUpdateTask
        ? updateTask(customTask)
        : () => {});

      if (!!result?.data?.status) {
        openNotificationWithIcon(
          'success',
          `Task ${state.openCreateTask ? 'created' : 'updated'} successfully!`,
        );
      } else {
        openNotificationWithIcon(
          'error',
          `Failed to ${state.openCreateTask ? 'create' : 'update'} new task!`,
        );
      }
      setState((prev) => ({
        ...prev,
        taskDetailInfo: undefined,
        openCreateTask: false,
        openUpdateTask: false,
        modalLoading: false,
      }));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await axios.delete(`/api/tasks/${id}`);
      notification.success({ message: 'Task deleted successfully!' });
      refetch();
    }
  };

  const renderTaskForm = (task) => (
    <div style={{ width: 300 }}>
      <Input
        placeholder="Title"
        value={task?.title || ''}
        onChange={(e) =>
          setState((prev) => ({ ...prev, taskDetailInfo: { ...task, title: e.target.value } }))
        }
      />
      <Input.TextArea
        placeholder="Description"
        value={task?.description || ''}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            taskDetailInfo: { ...task, description: e.target.value },
          }))
        }
        style={{ marginTop: 8 }}
      />
      <Select
        value={task?.status}
        onChange={(value) =>
          setState((prev) => ({
            ...prev,
            taskDetailInfo: { ...task, status: value },
          }))
        }
        style={{ width: '100%', marginTop: 8 }}
      >
        {Object.values(TASK_STATUS)?.map(({ key, label, color }) => (
          <Option key={key} value={key}>
            <span style={{ color }}>{label}</span>
          </Option>
        ))}
      </Select>
      <DatePicker
        value={!!task?.dueDate ? dayjs(Number(task?.dueDate)) : undefined}
        format={'DD/MM/YYYY'}
        onChange={(date) =>
          setState((prev) => ({
            ...prev,
            taskDetailInfo: { ...task, dueDate: date },
          }))
        }
        style={{ width: '100%', marginTop: 8 }}
      />
      <Button
        type="primary"
        onClick={() => handleSaveTask(task)}
        style={{ width: '100%', marginTop: 8 }}
      >
        Save
      </Button>
    </div>
  );

  const onTableChange = (_, filters, sort) => {
    const { field, order } = sort || {};
    setState((prev) => ({
      ...prev,
      sort: field,
      az: order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : undefined,
      filterField: Object.keys(filters)?.[0],
      filterValues: Object.values(filters)?.[0] as string[],
    }));
  };

  return (
    <>
      {contextHolder}
      <div className="w-full">
        <Flex gap={16} align="center" style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() => setState((prev) => ({ ...prev, openCreateTask: true }))}
          >
            Create Task
          </Button>
          <Input
            style={{ width: 200 }}
            value={state.searchTitle}
            onAfterChange={(value) => setState((prev) => ({ ...prev, searchTitle: value }))}
            placeholder="Search Title..."
          />
        </Flex>

        <Table
          columns={columns}
          dataSource={state.tasks}
          rowKey="id"
          loading={isLoading || isFetching}
          scroll={{ y: 500 }}
          onChange={onTableChange}
          onRow={(record) => ({
            onClick: () => onSelectTask(record),
          })}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={'Edit Task'}
          open={state.openUpdateTask}
          loading={state.modalLoading}
          cancelButtonProps={{ style: { display: 'none' } }}
          onCancel={() =>
            setState((prev) => ({ ...prev, openUpdateTask: false, taskDetailInfo: undefined }))
          }
          footer={null}
          centered
          width={350}
        >
          {renderTaskForm(state.taskDetailInfo)}
        </Modal>

        <Modal
          title={'Create Task'}
          open={state.openCreateTask}
          loading={state.modalLoading}
          cancelButtonProps={{ style: { display: 'none' } }}
          onCancel={() =>
            setState((prev) => ({ ...prev, openCreateTask: false, taskDetailInfo: undefined }))
          }
          footer={null}
          centered
          width={350}
        >
          {renderTaskForm(state.taskDetailInfo)}
        </Modal>
      </div>
    </>
  );
});

TaskListing.displayName = 'TaskListing';

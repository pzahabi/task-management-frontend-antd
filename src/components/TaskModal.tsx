import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { Task } from '../constants/types';
import { TaskStatus, TaskPriority } from '../constants/enums';

const { Option } = Select;

interface TaskModalProps {
    visible: boolean;
    onClose: () => void;
    task: Task | null;
    onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose, task, onSave }) => {
    const [form] = Form.useForm();
    const isEditMode = Boolean(task);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const taskData = {
                ...task,
                ...values,
            };
            onSave(taskData);
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    return (
        <Modal
            title={isEditMode ? "Edit Task" : "Add Task"}
            visible={visible}
            onOk={handleSubmit}
            onCancel={onClose}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={task || { status: TaskStatus.HOLD, priority: TaskPriority.LOW }}
            >
                <Form.Item
                    name="title"
                    label="Task Title"
                    rules={[{ required: true, message: 'Please input task title!' }]}
                >
                    <Input disabled={isEditMode} />
                </Form.Item>
                <Form.Item name="description" label="Description"
                rules={[{ required: true, message: 'Please input task description!' }]}>
                    <Input.TextArea disabled={isEditMode} />
                </Form.Item>
                <Form.Item name="status" label="Status">
                    <Select placeholder="Select status" disabled={!isEditMode}>
                        <Option value={TaskStatus.HOLD}>{TaskStatus.HOLD}</Option>
                        <Option value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</Option>
                        <Option value={TaskStatus.DONE}>{TaskStatus.DONE}</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="priority" label="Priority">
                    <Select placeholder="Select priority">
                        <Option value={TaskPriority.LOW}>{TaskPriority.LOW}</Option>
                        <Option value={TaskPriority.NORMAL}>{TaskPriority.NORMAL}</Option>
                        <Option value={TaskPriority.HIGH}>{TaskPriority.HIGH}</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="duedate" label="Due Date"
                rules={[{ required: true, message: 'Please select Due Date!' }]}>
                    <Input type="date" disabled={isEditMode} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskModal;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Typography, Button, Input, Select } from "antd";
import { setTasks, addTask, updateTask, deleteTask } from "../slices/taskSlice";
import TaskService from "../services/Tasks";
import { Task } from "../constants/types";
import TaskModal from "./TaskModal";
import { TaskStatus, TaskPriority } from "../constants/enums"; // Import enums
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Option } = Select;

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks: Task[] = useSelector((state: any) => state.tasks.tasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      if (!Cookies.get("token")) navigate("/login");
      try {
        const tasksFromApi = await TaskService.getTasks(
          searchQuery ? searchQuery : null,
          selectedStatus,
          selectedPriority
        );
        dispatch(setTasks(tasksFromApi));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    loadTasks();
  }, [dispatch, searchQuery, selectedStatus, selectedPriority, navigate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (value: TaskStatus | null) => {
    setSelectedStatus(value);
  };

  const handlePriorityChange = (value: TaskPriority | null) => {
    setSelectedPriority(value);
  };

  const showModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await TaskService.deleteTask(id);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSaveTask = async (task: Task) => {
    if (task.id) {
      try {
        const updatedTask = { ...task };
        const originalTask = tasks.find((t) => t.id === task.id);

        if (originalTask) {
          if (updatedTask.priority !== originalTask.priority) {
            await TaskService.updateTaskPriority(task.id, task.priority);
          }
          if (updatedTask.status !== originalTask.status) {
            await TaskService.updateTaskStatus(task.id, task.status);
          }
        }
        dispatch(updateTask(updatedTask));
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    } else {
      try {
        const newTask = await TaskService.addTask(task);
        dispatch(addTask(newTask));
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
    handleModalClose();
  };

  const logOut = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div>
      <Button
        type="primary"
        danger
        onClick={() => logOut()}
        style={{ marginBottom: "20px"}}
      >
        Log Out
      </Button>
      <Input
        placeholder="Search tasks"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: "20px" }}
      />
      <Select
        placeholder="Filter by Status"
        onChange={handleStatusChange}
        style={{ marginRight: "10px", marginBottom: "20px" }}
      >
        <Option value={null}>All</Option>
        <Option value={TaskStatus.HOLD}>{TaskStatus.HOLD}</Option>
        <Option value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</Option>
        <Option value={TaskStatus.DONE}>{TaskStatus.DONE}</Option>
      </Select>
      <Select
        placeholder="Filter by Priority"
        onChange={handlePriorityChange}
        style={{ marginRight: "10px", marginBottom: "20px" }}
      >
        <Option value={null}>All</Option>
        <Option value={TaskPriority.LOW}>{TaskPriority.LOW}</Option>
        <Option value={TaskPriority.NORMAL}>{TaskPriority.NORMAL}</Option>
        <Option value={TaskPriority.HIGH}>{TaskPriority.HIGH}</Option>
      </Select>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: "20px" }}
      >
        Add Task
      </Button>
      <List
        header={<div>Task List</div>}
        bordered
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => showModal(task)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => handleDelete(task.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={task.title}
              description={`Priority: ${task.priority}, Status: ${
                task.status
              }, Due Date: ${new Date(task.duedate).toLocaleDateString()}`}
            />
            <Typography.Text>{task.description}</Typography.Text>
          </List.Item>
        )}
      />
      {isModalVisible && (
        <TaskModal
          visible={isModalVisible}
          onClose={handleModalClose}
          task={editingTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default TaskList;

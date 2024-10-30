import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskList from "./components/TaskList";
import { Layout } from "antd";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Header
          style={{ color: "white", paddingBottom: "20px", height: "100px" }}
        >
          <h1>Task Manager</h1>
        </Header>
        <Content style={{ padding: "20px", minHeight: 'calc(100vh - 120px)' }}>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;

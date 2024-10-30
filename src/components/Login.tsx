import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { useForm, Controller } from "react-hook-form";
import { LoginCredentials as User } from "../constants/types";
import Cookies from "js-cookie";
import UserService from "../services/Users";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<User>();
  const navigate = useNavigate();

  const onSubmit = async (user: User) => {
    try {
      const response = await UserService.login(user);
      Cookies.set("token", response.data.accessToken);
      navigate("/");
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message }: { message: string | string[] } = error.response.data;

        const errorMessage = Array.isArray(message) ? message[0] : message;

        if (errorMessage.includes("username")) {
          setError("username", {
            type: "manual",
            message: errorMessage || "Username is incorrect",
          });
        } else if (errorMessage.includes("password")) {
          setError("password", {
            type: "manual",
            message: errorMessage || "Password is incorrect",
          });
        } else {
          setError("username", {
            type: "manual",
            message: errorMessage || "Login failed. Please try again.",
          });
        }
      } else {
        setError("username", {
          type: "manual",
          message: "Login failed. Please try again later.",
        });
      }
    }
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <Row justify="center">
        <Col xs={24} sm={24} md={12} lg={8}>
          <Form.Item
            label="Username"
            validateStatus={errors.username ? "error" : ""}
            help={errors.username ? errors.username.message : ""}
          >
            <Controller
              name="username"
              control={control}
              rules={{ required: "Username is required" }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password ? errors.password.message : ""}
          >
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
          <Button type="link" onClick={() => navigate('/signup')}>
            Don't have an account? Signup
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { SignupCredentials as User } from '../constants/types';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/Users';

export const Signup = () => {
    const { control, handleSubmit, setError, formState: { errors } } = useForm<User>();
    const navigate = useNavigate();

    const onSubmit = async (user: User) => {
        try {
            await UserService.Signup(user);
            navigate('/login');
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessages: string[] = Array.isArray(error.response.data.message) 
                    ? error.response.data.message 
                    : [error.response.data.message]; 

                errorMessages.forEach((errorMessage) => {
                    if (errorMessage.includes('username')) {
                        setError('username', { type: 'manual', message: errorMessage || 'Username is invalid' });
                    } else if (errorMessage.includes('password')) {
                        setError('password', { type: 'manual', message: errorMessage || 'Password is invalid' });
                    } else if (errorMessage.includes('email')) {
                        setError('email', { type: 'manual', message: errorMessage || 'Email is invalid' });
                    } else if (errorMessage.includes('name')) {
                        setError('name', { type: 'manual', message: errorMessage || 'Name is invalid' });
                    } else if (errorMessage.includes('surname')) {
                        setError('surname', { type: 'manual', message: errorMessage || 'Surname is invalid' });
                    } else {
                        setError('username', { type: 'manual', message: 'Signup failed. Please try again.' });
                    }
                });
            } else {
                setError('username', { type: 'manual', message: 'Signup failed. Please try again later.' });
            }
        }
    };

    return (
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
            <Row justify="center">
                <Col xs={24} sm={24} md={12} lg={8}>
                    <Form.Item
                        label="Username"
                        validateStatus={errors.username ? 'error' : ''}
                        help={errors.username ? (errors.username.message as string) : ''}
                    >
                        <Controller
                            name="username"
                            control={control}
                            rules={{ required: 'Username is required' }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        validateStatus={errors.password ? 'error' : ''}
                        help={errors.password ? (errors.password.message as string) : ''}
                    >
                        <Controller
                            name="password"
                            control={control}
                            rules={{ 
                                required: 'Password is required', 
                                minLength: { value: 8, message: 'Password must be at least 8 characters' } 
                            }}
                            render={({ field }) => <Input.Password {...field} />}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name ? (errors.name.message as string) : ''}
                    >
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Surname"
                        validateStatus={errors.surname ? 'error' : ''}
                        help={errors.surname ? (errors.surname.message as string) : ''}
                    >
                        <Controller
                            name="surname"
                            control={control}
                            rules={{ required: 'Surname is required' }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        validateStatus={errors.email ? 'error' : ''}
                        help={errors.email ? (errors.email.message as string) : ''}
                    >
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Email is invalid'
                                }
                            }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Signup
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

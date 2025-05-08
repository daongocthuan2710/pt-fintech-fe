'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, Divider, notification } from 'antd';
import { register } from '@/services/Auth';
const { Title } = Typography;

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function RegisterPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const result = await register(values);
      if (result?.status) {
        openNotificationWithIcon('success', 'Register successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } else {
        openNotificationWithIcon('error', result?.message || 'Register failed!');
      }
    } catch (error: any) {
      openNotificationWithIcon('error', error.response?.data?.message || 'Register failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', height: '100vh' }} className="bg-white">
        <div
          style={{
            flex: 1,
            backgroundImage: 'url(images/backgrounds/questionnaire-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 350 }}>
            <Title level={3} className="w-full text-center">
              Sign up
            </Title>

            <Form
              layout="vertical"
              onFinish={handleRegister}
              style={{ maxWidth: 400, margin: '0 auto' }}
            >
              <Form.Item
                label="UserName"
                name="userName"
                rules={[{ required: true, message: 'Please enter user name!' }]}
              >
                <Input placeholder="User name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please enter email!',
                  },
                  {
                    type: 'email',
                    message: 'Email is not in correct format!',
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter password!' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message:
                      'Password must be at least 6 characters, including uppercase, lowercase, numbers and special characters!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Confirmation password does not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{ backgroundColor: '#e44a00', borderColor: '#e44a00' }}
                  loading={loading}
                >
                  Register
                </Button>
              </Form.Item>
              <Divider className="w-full" />
              <Button
                className="text-center w-full"
                type="text"
                style={{ color: '#e44a00' }}
                onClick={() => router.push('/login')}
              >
                Sign in
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

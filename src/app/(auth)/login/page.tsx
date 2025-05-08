'use client';

import { Button, Divider, Form, Input, message, notification, Typography } from 'antd';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface TState {
  userName: string;
  password: string;
  errorMessage: string;
  loading: boolean;
}

const INITIAL_STATE: TState = {
  userName: '',
  password: '',
  errorMessage: '',
  loading: false,
};

export default function LoginPage() {
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

  const [state, setState] = useState(INITIAL_STATE);
  const router = useRouter();

  const onFinish = async (values) => {
    const { userName, password } = values || {};
    setState((prev) => ({ ...prev, loading: true }));
    if (!!userName && !!password) {
      const res = await signIn('credentials', {
        password,
        userName,
        redirect: false,
      });
      if (res?.ok) {
        openNotificationWithIcon('success', 'Login successfully!');
        router.push('/');
      } else {
        setState((prev) => ({ ...prev, errorMessage: 'Login failed' }));
        openNotificationWithIcon('error', 'Login failed', 'User name or password is incorrect!');
      }
    }
    setState((prev) => ({ ...prev, loading: false }));
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
              Sign in
            </Title>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="userName"
                label="User Name"
                rules={[{ required: true, message: 'Please enter your user name' }]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={state.loading}
                  style={{ backgroundColor: '#e44a00', borderColor: '#e44a00' }}
                >
                  Sign in
                </Button>
              </Form.Item>
              <Divider className="w-full" />
              <Button
                className="text-center w-full"
                type="text"
                style={{ color: '#e44a00' }}
                onClick={() => router.push('/register')}
              >
                Register
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

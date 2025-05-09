'use client';

import React from 'react';
import { Layout, Dropdown, Avatar, MenuProps, Flex } from 'antd';
import { SettingOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { DEFAULT_AVATAR } from '@/constants';
import { signOut, useSession } from 'next-auth/react';

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  const session = useSession();

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <ProfileOutlined />,
      onClick: () => {},
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => {},
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.clear();
        void signOut({
          callbackUrl: '/login',
        });
      },
    },
  ];

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#fff',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <a href="#">Plans</a>
        <a href="#">Apps</a>
      </div>
      <Flex align="center">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <Flex gap={8} align="center">
            {session?.data?.user?.name || ''}
            <Avatar
              style={{ cursor: 'pointer' }}
              src={session?.data?.user?.avatar || DEFAULT_AVATAR}
            />
          </Flex>
        </Dropdown>
      </Flex>
    </Header>
  );
};

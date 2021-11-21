import { Dropdown, Menu } from 'antd';
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { login_info, BACKEND_HOST, apis } from '../config';
import request from 'superagent';

export default function UserLogin() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (!login_info().has_login) return;
    request.get(apis.user_info)
      .query({ username: login_info().user })
      .then(res => setUserInfo(res.body));
  }, []);

  return login_info().has_login ? (
    <>
      <img
        alt=""
        style={{
          background: '#aaa',
          width: 46,
          height: 46,
          borderRadius: 6,
          float: 'right',
          marginTop: 6,
          marginLeft: 40,
        }}
        src={`${BACKEND_HOST}${userInfo.profile_photo}`}
      />
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              style={{
                fontWeight: 'bold',
                color: '#000',
              }}
              onClick={() => window.open(`${BACKEND_HOST}/admin`)}
            >
              管理系统
            </Menu.Item>
            <Menu.Item
              style={{
                fontWeight: 'bold',
                color: '#000',
              }}
              onClick={() => {
                localStorage.setItem('username', 'guest')
                window.location.href = '/';
              }}
            >
              退出登录
            </Menu.Item>
          </Menu>
        }
      >
        <Link
          onClick={() => window.location.href = `/user?username=${login_info().user}`}
          style={{
            fontWeight: 'bold',
            float: 'right',
          }}
          to={`/user?username=${login_info().user}`}
        >
          {login_info().user}
        </Link>
      </Dropdown>
    </>
  ) : (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item
            style={{
              fontWeight: 'bold',
              color: '#000',
            }}
              onClick={() => window.open(`${BACKEND_HOST}/admin`)}
          >
            管理系统
          </Menu.Item>
        </Menu>
      }
    >
      <Link
        style={{
          fontWeight: 'bold',
          float: 'right',
          color: '#000',
        }}
        to='/login'
      >
        请登录
      </Link>
    </Dropdown>
  )
};

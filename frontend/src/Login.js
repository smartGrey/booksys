import React from 'react'
import { Form, Input, Button, message } from 'antd';
import request from 'superagent';
import { apis } from './config';
import { Link } from "react-router-dom";


export default function Login() {
  const search = window.location.search;
  let next_page = (search.indexOf('next=') !== -1) ? search.split('?next=')[1] : '/';
  const onFinish = values => {
    request.post(apis.login)
      .send({
        username: values.username,
        password: values.password,
      })
      .then(res => {
        if (res.body.status === 'right') {
          message.success('登录成功, 即将跳转.');
          localStorage.setItem("username", res.body.username);

          // 跳转
          setTimeout(() => window.location.href = next_page, 1000);
        } else {
          message.error('用户名或密码错误,请重新确认.');
        }
      })
      .catch(err => message.error(err.response.text.slice(1, -1)))
  };

  return (
    <>
      <a
        style={{
          fontWeight: 'bold',
          fontSize: 24,
          marginLeft: 60,
          marginTop: 30,
          display: 'block',
          color: '#000',
          textDecoration: 'none',
        }}
        href='/'
      >
        网站首页
      </a>
      <div
        style={{
          display: 'inline-block',
          width: 400,
          position: 'absolute',
          left: '50%',
          top: '44%',
          transform: 'translate(-50%,-50%)',
          background: 'rgb(0,0,0,0.1)',
          padding: 30,
          paddingBottom: 30,
        }}
      >
        <h2
          style={{
            borderLeft: '4px solid #333',
            paddingLeft: 6,
            fontSize: 30,
            lineHeight: '30px',
          }}
        >
          登录
        </h2>


        <Form
          labelCol={{ span: 4 }}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={console.log}
          style={{
            marginTop: 50,
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="请输入您的用户名" style={{ height: 54, fontSize: 22 }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入您的密码" style={{ height: 54, fontSize: 22 }} />
          </Form.Item>

          <div
            style={{
              textAlign: 'center',
            }}
          >
            <Button type="primary" htmlType="submit" style={{ fontSize: 22, height: 44, width: 90 }}>
              登录
            </Button>
            <Link to={`/sign_in?next=${next_page}`}>
              <Button htmlType="submit" style={{ fontSize: 22, height: 44, width: 90, marginLeft: 40 }}>
                注册
              </Button>
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
}

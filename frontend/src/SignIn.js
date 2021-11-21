import React, { useState } from 'react'
import { Form, Input, Button, message, Upload, Image } from 'antd';
import request from 'superagent';
import { apis, BACKEND_HOST } from './config';
import ImgCrop from 'antd-img-crop';


export default function SignIn() {
  const search = window.location.search;
  let next_page = (search.indexOf('next=') !== -1) ? search.split('?next=')[1] : '/';
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const onFinish = values => {
    request.post(apis.sign_in)
      .send({
        username: values.username,
        password: values.password,
        profile_photo: profilePhotoUrl,
      })
      .then(res => {
        if (res.body.status === 'success') {
          message.success('注册成功, 即将跳转.')
          localStorage.setItem("username", res.body.username);
          setTimeout(() => window.location.href = next_page, 1000);
        } else {
          message.error('用户已存在.')
        }
      })
      .catch(err => message.error(err.response.text.slice(1, -1)));
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
          paddingBottom: 10,
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
          注册新用户
        </h2>


        <Form
          labelCol={{ span: 4 }}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={console.log}
          style={{
            marginTop:30,
          }}
        >
          <ImgCrop rotate>
            <Upload
              action={apis.sign_in}
              listType="picture-card"
              onChange={({ file }) => setProfilePhotoUrl(file.response)}
              onPreview={async file => {
                let src = file.url;
                if (!src) {
                  src = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file.originFileObj);
                    reader.onload = () => resolve(reader.result);
                  });
                }
                const image = new Image();
                image.src = BACKEND_HOST + '/static/' + file.response;
                const imgWindow = window.open(src);
                imgWindow.document.write(image.outerHTML);
              }}
            >
              + 上传头像
            </Upload>
          </ImgCrop>

          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
            style={{ marginTop: 20 }}
          >
            <Input placeholder="请输入您的用户名" style={{ height: 54, fontSize: 22 }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入您的密码" style={{ height: 54, fontSize: 22 }} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 9 }}>
            <Button type="primary" htmlType="submit" style={{ fontSize: 22, height: 44, width: 90 }}>
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

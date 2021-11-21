import React, { useState, useEffect } from 'react'
import { Input, Form, Card, Radio, message, Modal, Upload, Tabs, List } from 'antd';
import {
  EditOutlined, HeartOutlined
, HeartFilled } from '@ant-design/icons';
import request from 'superagent';
import { login_info, BACKEND_HOST, apis, renderBooks } from './config';
import Header from './components/Header'
import ImgCrop from 'antd-img-crop';
import moment from 'moment';
import 'moment/locale/zh-cn'

const create = React.createElement;
const { TabPane } = Tabs;

export default function User() {
  const [userInfoModelShow, setUserInfoModelShow] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [userInfoValues, setUserInfoValues] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [readHistoryBooks, setReadHistoryBooks] = useState([]);
  const [favorBooks, setFavorBooks] = useState([]);
  const [myWritings, setMyWritings] = useState([]);
  const [userMessages, setUserMessages] = useState([]);

  const onUserInfoFormFinish = () => {
    request.post(apis.user_info)
      .send({
        name: userInfoValues.name,
        password: userInfoValues.password,
        gender: userInfoValues.gender,
        description: userInfoValues.description,
        profile_photo: profilePhotoUrl,
        id: userInfo.id,
      })
      .then(res => {
        if (res.body.status === 'success') {
          setUserInfoModelShow(false);
          message.success('修改成功.');
          const new_name = res.body.new_name;
          if (new_name !== login_info().user) {
            localStorage.setItem("username", new_name);
            window.location.href = `/user?username=${new_name}`;
          } else {
            window.location.reload();
          }
          get_user_Info();
        } else {
          message.error(res.body.reason);
        }
      });
  };

  const search = window.location.search;
  let visited_user = decodeURI(search.split('?username=')[1]);

  const post_action = (api, params) => {
    request.post(api)
      .send(params)
      .then(res => {
        if (res.body !== 'done') {
          message.error('请稍后再试.');
          return;
        }
        get_user_Info();
      })
  };

  const get_user_Info = () => {
    request.get(apis.user_info)
      .query({
        username: visited_user,
        visit_username: login_info().user,
      })
      .then(res => {
        setUserInfo(res.body)
        setProfilePhotoUrl(res.body.profile_photo)
        setUserInfoValues(res.body)
      });
  }

  useEffect(() => {
    get_user_Info();
    request.get(apis.read_history)
      .query({ user: visited_user })
      .then(res => setReadHistoryBooks(res.body));
    request.get(apis.favor_books)
      .query({ user: visited_user })
      .then(res => setFavorBooks(res.body));
    request.get(apis.my_writings)
      .query({ user: visited_user })
      .then(res => setMyWritings(res.body));
    request.get(apis.user_messages)
      .query({ user: visited_user})
      .then(res => setUserMessages(res.body));
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <div
        style={{
          width: 1200,
          margin: '0 auto',
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            height: '100%',
            width: 750,
            padding: '0 20px',
            paddingTop: 20,
          }}
        >
          <Tabs
            type="card"
            animated={true}
            style={{
              background: '#fff',
              width: 700,
              minHeight: 370,
              margin: '0 auto',
              borderRadius: '3px',
              boxShadow: '2px 2px 4px 2px #aaa',
              userSelect: 'none',
              paddingBottom: 30,
            }}
          >
            <TabPane tab="作品" key="3">
              {renderBooks(myWritings, 3)}
            </TabPane>
            <TabPane tab="最近阅读" key="1">
              {renderBooks(readHistoryBooks,3)}
            </TabPane>
            <TabPane tab="看单" key="2">
              {renderBooks(favorBooks,3)}
            </TabPane>
          </Tabs>
          {
            login_info().user === visited_user && (
              <List
                itemLayout="horizontal"
                dataSource={userMessages}
                header={<span style={{ marginLeft: 20 }}>我的动态 & 消息</span>}
                style={{
                  background: '#fff',
                  width: 700,
                  margin: '0 auto',
                  borderRadius: '3px',
                  boxShadow: '2px 2px 4px 2px #aaa',
                  marginTop: 20,
                }}
                pagination={{
                  pageSize: 5,
                  showQuickJumper: true,
                  hideOnSinglePage: true,
                  style: {
                    marginRight: 20,
                    paddingBottom: 16,
                  },
                }}
                renderItem={item => (
                  <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                    <div>
                      <span
                        style={{ fontWeight: 'bold', fontSize: 16 }}
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      />
                      <span style={{ float: 'right', color: '#aaa' }}>
                        {moment(item.send_time).fromNow()}
                      </span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span dangerouslySetInnerHTML={{ __html: item.content }}/>
                    </div>
                  </div>
                )}
              />
            )
          }
        </div>
        <div
          style={{
            display: 'inline-block',
            height: '100%',
            width: 450,
            paddingTop: 20,
            float: 'right',
          }}
        >
          <Card
            style={{ width: 400, margin: '0 auto', boxShadow: '2px 2px 4px 2px #aaa' }}
            cover={
              <img
                alt="example"
                src={`${BACKEND_HOST}${userInfo.profile_photo}`}
              />
            }
            actions={[
              login_info().user === visited_user ? (
                <EditOutlined
                  onClick={() => setUserInfoModelShow(true)}
                />
              ) : (
                create(
                  userInfo.if_follow_author ? HeartFilled : HeartOutlined,
                  {
                    style: {
                      cursor: 'pointer',
                      color: 'red',
                      marginLeft: 6,
                      fontSize: 26,
                      transform: 'translateY(2px)'
                    },
                    onClick: () => {
                      if (login_info().has_login) {
                        post_action(apis.follow_user, {
                          user: login_info().user,
                          author: visited_user,
                        })
                      } else {
                        window.location.href = '/login'
                      }
                    },
                  }
                )
              )
            ]}
          >
            <Card.Meta
              title={
                <>
                  <span style={{ fontSize: 22 }}>{userInfo.name}</span>
                  <span style={{ marginLeft: 30 }}>{userInfo.gender}</span>
                </>
              }
              description={<div style={{ marginTop: 20 }}>{userInfo.description}</div>}
            />
          </Card>
        </div>
      </div>
      <Modal
        title="修改你的信息:"
        closable={true}
        maskClosable={true}
        destroyOnClose={false}
        onOk={onUserInfoFormFinish}
        onCancel={() => setUserInfoModelShow(false)}
        visible={userInfoModelShow}
      >
        <Form
          labelCol={{ span: 4 }}
          name="basic"
          onValuesChange={(_, values) => setUserInfoValues(values)}
          style={{
            marginTop: 30,
          }}
          initialValues={{
            gender: userInfo.gender,
            password: userInfo.password,
            name: userInfo.name,
            description: userInfo.description,
          }}
        >
          <ImgCrop rotate>
            <Upload
              action={apis.user_info}
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
            name="gender"
            style={{ marginTop: 20 }}
          >
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入用户名!' }]}
            style={{ marginTop: 20 }}
          >
            <Input placeholder="请输入新的用户名" style={{ height: 54, fontSize: 22 }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入新的密码" style={{ height: 54, fontSize: 22 }} />
          </Form.Item>

          <Form.Item name="description">
            <Input.TextArea
              allowClear
              placeholder="写一些介绍,让读者了解你吧."
              autoSize={{ minRows: 6, maxRows: 1000000 }}
              showCount
              maxLength={3000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

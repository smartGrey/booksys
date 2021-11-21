import React, { useState, useEffect } from 'react'
import { Input, Button, Drawer, message, Image } from 'antd';
import {
  HeartOutlined,
  LikeOutlined,
  HeartFilled,
  LikeFilled,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import request from 'superagent';
import { login_info, apis, BACKEND_HOST, UserLink } from './config';
import Markdown from 'react-markdown';
import moment from 'moment';
import 'moment/locale/zh-cn'

const create = React.createElement;

export default function Book() {
  const [detailVisible, setDetailVisible] = useState(false);
  const [data, setData] = useState({ comments: [] });
  const [commentInputVal, setCommentInputVal] = useState('');

  const get_book_data = () => {
    request.get(apis.book_page_data)
      .query({
        book_id: window.location.search.split('?book_id=')[1],
        user: login_info().user,
      })
      .then(res => {
        if (res.body.status !== 'success') {
          message.error('获取书籍信息错误.');
          return;
        }
        setData(res.body.data);
      });
  }
  useEffect(get_book_data, []);

  const post_action = (api, params) => {
    if (!login_info().has_login) {
      message.info('请先登录.');
      setTimeout(() => window.location.href = `/login?next=/book?book_id=${data.id}`, 1000);
      return;
    }
    request.post(api)
      .send(params)
      .then(res => {
        if (res.body !== 'done') {
          message.error('请稍后再试.');
          return;
        }
        get_book_data();
      })
  };

  return (
    <>
      <div
        style={{
          background: '#fff',
          lineHeight: '60px',
          padding: '0 80px',
          boxShadow: '1px 3px 3px #aaa',
          fontSize: 20,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1,
          userSelect: 'none',
        }}
      >
        <span
          style={{ fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => window.location.href = '/'}
        >
          &lt; 首页
        </span>

        <span
          style={{
            fontWeight: 'bold',
            marginLeft: 50,
          }}
          to={login_info().has_login ? '/write' : '/login?next=/write'}
        >
          {data.book_name}
        </span>

        <span
          style={{
            fontWeight: 'bold',
            marginLeft: 50,
          }}
          to={login_info().has_login ? '/write' : '/login?next=/write'}
        >
          <img
            alt=""
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              marginTop: '-4px',
              marginRight: 10,
            }}
            src={`${BACKEND_HOST}${data.author_profile_url}`}
          />
          <UserLink name={data.author_name} />
          {
            (data.author_name !== login_info().user) && create(
              data.if_follow_author ? HeartFilled : HeartOutlined,
              {
                style: {
                  cursor: 'pointer',
                  color: 'red',
                  marginLeft: 6,
                  fontSize: 26,
                  transform: 'translateY(3px)'
                },
                onClick: () => post_action(apis.follow_user, {
                  user: login_info().user,
                  author: data.author_name,
                }),
              }
            )
          }
        </span>

        <span
          style={{
            fontWeight: 'bold',
            marginLeft: 70,
          }}
          to={login_info().has_login ? '/write' : '/login?next=/write'}
        >
          {
            create(
              data.if_like_book ? LikeFilled : LikeOutlined,
              {
                style: {
                  cursor: 'pointer',
                  color: '#4169E1',
                  marginRight: 6,
                  fontSize: 26,
                  transform: 'translateY(2px)'
                },
                onClick: () => post_action(apis.like_a_book, {
                  user: login_info().user,
                  book_id: data.id,
                }),
              }
            )
          }
          <span
            style={{
              fontSize: 16,
              color: '#777'
            }}
          >
            {data.book_like_num}
          </span>
        </span>

        <span
          style={{
            fontWeight: 'bold',
            marginLeft: 50,
          }}
          to={login_info().has_login ? '/write' : '/login?next=/write'}
        >
          {
            create(
              data.if_favor_book ? StarFilled : StarOutlined,
              {
                style: {
                  cursor: 'pointer',
                  color: '#fFaF00',
                  marginRight: 6,
                  fontSize: 26,
                  transform: 'translateY(3px)'
                },
                onClick: () => post_action(apis.favor_a_book, {
                  user: login_info().user,
                  book_id: data.id,
                }),
              }
            )
          }
          想看
          <span
            style={{
              fontSize: 16,
              color: '#777',
              marginLeft: 4,
            }}
          >
            {data.book_favor_num}
          </span>
        </span>

        <span
          style={{
            fontWeight: 'bold',
            float: 'right',
            cursor: 'pointer',
          }}
          onClick={() => setDetailVisible(true)}
        >
          书籍详情
        </span>

        <Drawer
          title="书籍详情"
          placement="right"
          onClose={() => setDetailVisible(false)}
          visible={detailVisible}
          width={400}
          forceRender={true}
          mask={false}
          bodyStyle={{
            paddingBottom: 80,
          }}
        >
          <Image
            width={150}
            height={180}
            src={`${BACKEND_HOST}${data.cover_pic}`}
            fallback={`${BACKEND_HOST}/static/default_book_cover.jpg`}
          />

          <p
            style={{
              marginTop: 4,
              fontSize: 14,
              color: '#999',
            }}
          >
            出版时间: {moment(data.write_time).fromNow()}
            <br />
            字数: {data.words_number} 字
          </p>

          <p
            style={{
              borderLeft: '3px solid #000',
              fontSize: 18,
              lineHeight: '20px',
              paddingLeft: 5,
              marginTop: 20,
            }}
          >
            作者
          </p>
          <p
            style={{
              marginTop: 14,
              fontSize: 16,
              textIndent: '1.5rem',
            }}
          >
            {data.author_name && <UserLink name={data.author_name} />}
            {data.author_gender && `，${data.author_gender}`}
            {data.author_desc && `，个性签名：${data.author_desc}`}
          </p>

          <p
            style={{
              borderLeft: '3px solid #000',
              fontSize: 18,
              lineHeight: '20px',
              paddingLeft: 5,
              marginTop: 30,
            }}
          >
            书籍介绍
          </p>
          <p
            style={{
              marginTop: 14,
              fontSize: 16,
              textIndent: '1.5rem',
            }}
          >
            {data.description}
          </p>
          {!data.description && '暂无介绍'}


          <p
            style={{
              borderLeft: '3px solid #000',
              fontSize: 18,
              lineHeight: '20px',
              paddingLeft: 5,
              marginTop: 30,
            }}
          >
            评论
          </p>
          <Input.TextArea
            onChange={e => setCommentInputVal(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 60 }}
            placeholder="输入评论内容..."
            value={commentInputVal}
          />
          <div
            style={{ textAlign: 'right', marginTop: 10 }}
          >
            <Button
              type="primary"
              size="small"
              disabled={!commentInputVal}
              onClick={() => {
                post_action(apis.comment_book, {
                  user: login_info().user,
                  book_id: data.id,
                  content: commentInputVal,
                });
                setCommentInputVal('');
              }}
            >
              评论
            </Button>
          </div>
          {
            !data.comments.length ? '暂无评论' : (
              data.comments.map((comment, i) => (
                <div key={i} style={{ marginTop: 28, fontSize: 16, overflow: 'hidden' }}>
                  {comment.content}
                  <div style={{ marginTop: 6, color: '#999', fontSize: 14 }}>
                    <UserLink style={{ float: 'left' }} name={comment.user} />
                    <DeleteOutlined
                      style={{
                        float: 'right',
                        color: 'red',
                        marginTop: 4,
                        marginLeft: 10,
                        display: ([
                          comment.user,
                          data.author_name,
                        ].indexOf(login_info().user) !== -1) ? 'inline' : 'none',
                      }}
                      onClick={() => {
                        request.delete(apis.comment_book)
                          .send({ id: comment.id })
                          .then(res => {
                            if (res.body !== 'done') {
                              message.error('请稍后再试.');
                              return;
                            }
                            get_book_data();
                          })
                      }}
                    />
                    <span style={{ float: 'right' }}>{moment(comment.comment_time).fromNow()}</span>
                  </div>
                </div>
              ))
            )
          }
        </Drawer>
      </div>


      <div
        style={{
          width: 880,
          paddingLeft: 70,
          paddingTop: 40,
          paddingBottom: 50,
          marginTop: 60,
        }}
      >
        <Markdown>{data.body}</Markdown>
      </div>
    </>
  );
}

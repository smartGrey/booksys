import React, { useState, useEffect } from 'react'
import { Image, List, Typography } from 'antd';
import {
  HeartFilled,
  LikeFilled,
  MessageFilled,
  StarFilled,
} from '@ant-design/icons';
import Header from './components/Header'
import request from 'superagent';
import { apis, BACKEND_HOST, UserLink, BookLink, higntlight_text } from './config';
import moment from 'moment';
import 'moment/locale/zh-cn'

const { Paragraph } = Typography;

const Title = ({title}) => (
  <div
    style={{
      fontSize: 24,
      fontWeight: 'bold',
      borderLeft: '6px solid currentColor',
      color: '#444',
      lineHeight: '28px',
      paddingLeft: 10,
    }}
  >
    {title}
  </div>
);


export default function Search() {
  const keywords = decodeURI(window.location.search.split('?keywords=')[1]);
  const [searchResult, setSearchResult] = useState({});
  useEffect(() => {
    request.get(apis.search)
      .query({ keywords: keywords })
      .then(res => setSearchResult(res.body));
  }, [keywords])

  return (
    <>
      <Header searchKeyWords={keywords} />
      <div
        style={{
          width: 1200,
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            width: 750,
            padding: '20px 24px',
            float: 'left',
          }}
        >
          <Title title="相关书籍" />
          <List
            itemLayout="vertical"
            size="large"
            style={{
              background: '#fff',
              boxShadow: '2px 2px 4px 2px #aaa',
              marginTop: 14,
            }}
            locale={{ emptyText: '没有找到相关书籍'}}
            pagination={{
              style: {
                marginRight: 20,
                paddingBottom: 16,
              },
              pageSize: 3,
              showQuickJumper: true,
              hideOnSinglePage: true,
            }}
            dataSource={searchResult.books}
            renderItem={data => (
              <List.Item key={data.title} style={{ position: 'relative' }}>
                <Image
                  width={185}
                  height={222}
                  src={`${BACKEND_HOST}${data.cover_pic}`}
                  style={{
                    display: 'inline-block'
                  }}
                />
                <div
                  style={{
                    display: 'inline-block',
                    height: 222,
                    float: 'right',
                    width: 'calc(100% - 185px)',
                    padding: '8px 18px',
                  }}
                >
                  <BookLink
                    name={data.name}
                    id={data.id}
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                    }}
                    searchText={keywords}
                  />
                  <div style={{ fontSize: 18, marginTop: 8, fontWeight: 'bold' }}>
                    作者： <UserLink name={data.author_name} searchText={keywords} />
                  </div>
                  <div style={{ fontSize: 16, marginTop: 8 }}>
                    发布时间：  {moment(data.write_time).fromNow()}
                    <span style={{ marginLeft: 50 }}>字数： {data.words_number} 字</span>
                  </div>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ fontSize: 15, marginTop: 8, marginBottom: 8 }}
                  >
                    内容简介：{higntlight_text(data.description || '暂无',keywords)}
                  </Paragraph>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ fontSize: 15, marginTop: 8 }}
                  >
                    正文节选： {higntlight_text(data.body, keywords)}
                  </Paragraph>

                  <div
                    style={{
                      position: 'absolute',
                      borderLeft: '2px solid currentColor',
                      borderBottom: '2px solid currentColor',
                      right: 0,
                      top: 0,
                      color: '#bbb',
                      padding: '2px 20px',
                      fontSize: 18,
                    }}
                  >
                    <span style={{ marginRight: 24 }}><LikeFilled /> {data.book_like_num}</span>
                    <span style={{ marginRight: 24 }}><StarFilled /> {data.book_favor_num}</span>
                    <span><MessageFilled /> {data.comments_num}</span>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div
          style={{
            display: 'inline-block',
            width: 450,
            padding: '20px 24px',
          }}
        >
          <Title title="相关用户" />
          <List
            itemLayout="vertical"
            size="large"
            style={{
              background: '#fff',
              boxShadow: '2px 2px 4px 2px #aaa',
              marginTop: 14,
            }}
            locale={{ emptyText: '没有找到相关书籍' }}
            pagination={{
              style: {
                marginRight: 20,
                paddingBottom: 16,
              },
              pageSize: 3,
              showQuickJumper: true,
              hideOnSinglePage: true,
            }}
            dataSource={searchResult.users}
            renderItem={data => (
              <List.Item key={data.title} style={{ position: 'relative', overflow: 'hidden' }}>
                <Image
                  width={80}
                  height={80}
                  src={`${BACKEND_HOST}${data.profile_photo}`}
                  style={{
                    display: 'inline-block',
                    borderRadius: 6,
                  }}
                />
                <div
                  style={{
                    display: 'inline-block',
                    float: 'right',
                    width: 'calc(100% - 80px)',
                    padding: '4px 20px',
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                    <UserLink name={data.name} searchText={keywords} />
                  </div>
                  <div style={{ fontSize: 16, marginTop: 8 }}>
                    性别：{data.gender}
                    <span style={{ marginLeft: 20 }}>注册时间：{moment(data.create_time).fromNow()}</span>
                  </div>
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: true }}
                    style={{
                      fontSize: 15,
                      marginTop: 10,
                      wordBreak: 'break-all',
                      whiteSpace: 'break-word',
                      background: '#fff',
                      marginBottom: 0,
                    }}
                  >
                    用户简介：{higntlight_text(data.description || '暂无', keywords)}
                  </Paragraph>

                  <div
                    style={{
                      position: 'absolute',
                      borderLeft: '2px solid currentColor',
                      borderBottom: '2px solid currentColor',
                      right: 0,
                      top: 0,
                      color: '#bbb',
                      padding: '2px 14px',
                      fontSize: 18,
                    }}
                  >
                    <HeartFilled style={{ transform: 'translateY(1px)' }} /> {data.followers_num}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </>
  );
}

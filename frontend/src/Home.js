import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
import Header from './components/Header'
import request from 'superagent';
import { apis, login_info, renderBooks } from './config';
import SearchInput from './components/SearchInput'

const { TabPane } = Tabs;

export default function Home() {
  const [recommendBooks, setRecommendBooks] = useState([]);
  const [readHistoryBooks, setReadHistoryBooks] = useState([]);
  const [favorBooks, setFavorBooks] = useState([]);
  const [myWritings, setMyWritings] = useState([]);

  useEffect(() => {
    request.get(apis.recommend_books)
      .then(res => setRecommendBooks(res.body));

    if (!login_info().has_login) return;

    request.get(apis.read_history)
      .query({ user: login_info().user })
      .then(res => setReadHistoryBooks(res.body));
    request.get(apis.favor_books)
      .query({ user: login_info().user })
      .then(res => setFavorBooks(res.body));
    request.get(apis.my_writings)
      .query({ user: login_info().user })
      .then(res => setMyWritings(res.body));
  }, []);

  return (
    <>
      <Header hideSearchInput={true} />
      <SearchInput
        style={{
          display: 'block',
          margin: '0 auto',
          marginTop: 100,
        }}
      />
      <Tabs
        type="card"
        animated={true}
        style={{
          background: 'rgba(255,255,255,0.95)',
          width: 1000,
          height: 570,
          margin: '0 auto',
          marginTop: 40,
          borderRadius: '12px',
          boxShadow: '2px 2px 3px 3px #aaa',
          userSelect: 'none',
        }}
      >
        <TabPane tab="推荐书籍" key="4">
          {renderBooks(recommendBooks)}
        </TabPane>
        {
          login_info().has_login && (
            <>
              <TabPane tab="最近阅读" key="1">
                {renderBooks(readHistoryBooks)}
              </TabPane>
              <TabPane tab="我的看单" key="2">
                {renderBooks(favorBooks)}
              </TabPane>
              <TabPane tab="我的创作" key="3">
                {renderBooks(myWritings)}
              </TabPane>
            </>
          )
        }
      </Tabs>
    </>
  );
}

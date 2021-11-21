import { Input, message } from 'antd';
import React from 'react'

export default function SearchInput(props) {
  const if_search_page = window.location.pathname === '/search';
  return (
    <Input.Search
      placeholder="搜索你想看的书或作者吧~"
      onSearch={val => {
        if (!val) {
          message.info('请输入搜索关键词.');
          return;
        }
        if (if_search_page) {
          window.location.href = `/search?keywords=${val}`;
        } else {
          window.open(`/search?keywords=${val}`);
        }
      }}
      enterButton
      className="home_search_input"
      style={{
        textAlign: 'center',
        width: 500,
        ...props.style,
      }}
      defaultValue={props.searchKeyWords}
    />
  )
};

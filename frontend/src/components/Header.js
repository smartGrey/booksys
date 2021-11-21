import { Modal } from 'antd';
import React from 'react'
import { Link } from "react-router-dom";
import { login_info } from '../config';
import UserLogin from './UserLogin'
import SearchInput from './SearchInput'

export default function Header(props) {

  return (
    <>
      <div
        style={{
          background: '#fff',
          lineHeight: '60px',
          opacity: 0,
        }}
      >
        unvisiable
      </div>
      <div
        style={{
          background: '#fff',
          lineHeight: '60px',
          padding: '0 80px',
          boxShadow: '1px 3px 3px #aaa',
          userSelect: 'none',
          fontSize: 16,
          position: 'fixed',
          height: 60,
          top: 0,
          zIndex: 1,
          width: '100%',
        }}
      >
        <Link
          style={{
            fontWeight: 'bold',
            fontSize: 22,
            display: 'inline-block'
          }}
          to="/"
        >
          网站首页
      </Link>

        {
          !props.hideSearchInput && (
            <SearchInput
              style={{
                marginTop: 15,
                marginLeft: 200,
              }}
              searchKeyWords={props.searchKeyWords}
            />
          )
        }

        <UserLogin />
        <Link
          style={{
            fontWeight: 'bold',
            float: 'right',
            color: '#000',
            marginRight: 30,
          }}
          to={login_info().has_login ? '/write' : '/login?next=/write'}
        >
          开始创作
        </Link>
        <span
          style={{
            fontWeight: 'bold',
            float: 'right',
            marginRight: 30,
            cursor: 'pointer',
          }}
          onClick={() => {
            Modal.info({
              icon: null,
              closable: true,
              maskClosable: true,
              width: 800,
              bodyStyle: {
                height: 500,
                overflowY: 'auto',
              },
              content: <img src="/md_introduce.png" alt="" />,
            });
          }}
        >
          Markdown 快速入门
      </span>
      </div>
    </>
  );
}

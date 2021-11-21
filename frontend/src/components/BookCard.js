import React from 'react'
import { Typography } from 'antd';
import { Link } from "react-router-dom";
import { BACKEND_HOST } from '../config';

export default function BookCard(props) {
  return (
    <Link
      to={`/book?book_id=${props.book_message.id}`}
      style={{
        width: 160,
        boxShadow: '1px 1px 5px #666',
        display: 'inline-block',
        position: 'relative',
        ...props.style,
      }}
    >
      <img
        alt="封面"
        style={{ width: '100%' }}
        src={`${BACKEND_HOST}${props.book_message.cover_pic}`}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0.55))',
        }}
      >
        <Typography.Paragraph
          style={{
            color: '#000',
            padding: '2px 8px',
            paddingBottom: 0,
            fontSize: 16,
            margin: 0,
            wdith: '100%',
            fontWeight: 'bold',
          }}
          ellipsis={true}
        >
          {props.book_message.name}
        </Typography.Paragraph>
        <Typography.Paragraph
          style={{
            color: '#666',
            padding: '0 8px',
            fontSize: '8px',
            margin: 0,
            height: 40,
          }}
          ellipsis={{
            rows: 1,
            expandable: false,
            tooltip: true,
          }}
        >
          {props.book_message.description}
        </Typography.Paragraph>
      </div>
    </Link>
  );
}

import { Empty, List } from 'antd';
import BookCard from './components/BookCard'
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';

export const BACKEND_HOST = 'http://127.0.0.1:8000';

export const apis = {
  'recommend_books': `${BACKEND_HOST}/recommend_books`,
  'read_history': `${BACKEND_HOST}/read_history`,
  'favor_books': `${BACKEND_HOST}/favor_books`,
  'my_writings': `${BACKEND_HOST}/my_writings`,
  'publish_book': `${BACKEND_HOST}/publish_book`,
  'book_page_data': `${BACKEND_HOST}/book_page_data`,
  'favor_a_book': `${BACKEND_HOST}/favor_a_book`,
  'like_a_book': `${BACKEND_HOST}/like_a_book`,
  'follow_user': `${BACKEND_HOST}/follow_user`,
  'comment_book': `${BACKEND_HOST}/comment_book`,
  'book_cover': `${BACKEND_HOST}/book_cover`,
  'user_info': `${BACKEND_HOST}/user_info`,
  'user_messages': `${BACKEND_HOST}/user_messages`,
  'search': `${BACKEND_HOST}/search`,
  'login': `${BACKEND_HOST}/login`,
  'sign_in': `${BACKEND_HOST}/sign_in`,
};

export const login_info = () => {
  if (!localStorage.getItem('username'))
    localStorage.setItem('username', 'guest');
  return {
    user: localStorage.getItem('username'),
    has_login: localStorage.getItem('username') !== 'guest',
  };
};

export const renderBooks = (books, column=4) => (
  books.length
    ? (
      <List
        grid={{ column: column }}
        dataSource={books}
        renderItem={book => <BookCard key={book.id} style={{ margin: '14px 0' }} book_message={book} />}
        pagination={{
          position: 'bottom',
          pageSize: column * 2,
          showQuickJumper: true,
          hideOnSinglePage: true,
        }}
        style={{
          padding: '0 40px',
          marginTop: '-10px',
        }}
      />
    ) : <Empty description="没有书籍" style={{ marginTop: 100 }} />
);


export const higntlight_text = (text,word) => (
  <Highlighter
    highlightStyle={{ backgroundColor: 'rgb(255,255,200)', padding: 2 }}
    searchWords={[word]}
    autoEscape
    textToHighlight={text ? text.toString() : ''}
  />
);

export function UserLink(props) {
  return (
    <Link
      onClick={() => window.location.href = `/user?username=${props.name}`}
      style={{
        ...props.style
      }}
      to={`/user?username=${login_info().user}`}
    >
      {higntlight_text(props.name,props.searchText)}
    </Link>
  )
};

export function BookLink(props) {
  return (
    <Link
      onClick={() => window.location.href = `/book?book_id=${props.id}`}
      style={{
        ...props.style
      }}
      to={`/book?book_id=${props.id}`}
    >
      {higntlight_text(props.name, props.searchText)}
    </Link>
  )
};

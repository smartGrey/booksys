import React, { useState } from 'react'
import { Input, Row, Col, Button, message, Popconfirm, Modal, Badge, Upload, Image } from 'antd';
import request from 'superagent';
import { apis, login_info, BACKEND_HOST } from './config';
import Header from './components/Header'
import MarkdownEditor from '@uiw/react-markdown-editor';
import ImgCrop from 'antd-img-crop';

const btn_style = {
  borderRadius: '24px',
  height: '100%',
  fontSize: 18,
  width: '100%',
};

export default function Write(props) {
  const [bookBody, setBookBody] = useState('');
  const [bookName, setBookName] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState('');
  const [coverModelShow, setCoverModelShow] = useState(false);
  return (
    <>
      <Header hideSearchInput={true} />
      <Row
        style={{
          width: 1100,
          margin: '40px auto',
          lineHeight: '44px',
        }}
        gutter={[14,0]}
      >
        <Col span={12}>
          <Input
            placeholder="书名"
            style={btn_style}
            onChange={e => setBookName(e.target.value)}
          />
        </Col>
        <Col span={3}>
          <Button
            shape="round"
            style={btn_style}
            onClick={() => setCoverModelShow(true)}
          >
            <Badge dot={bookCoverUrl} offset={[8, 0]}>选择封面</Badge>
          </Button>
        </Col>
        <Col span={3}>
          <Button
            shape="round"
            style={btn_style}
            onClick={() => {
              Modal.info({
                title: '为书籍添加简介:',
                icon: null,
                destroyOnClose: true,
                closable: true,
                maskClosable: true,
                content: (
                  <Input.TextArea
                    defaultValue={bookDesc}
                    allowClear
                    onChange={e => setBookDesc(e.target.value)}
                    style={{ marginTop: 30, overflow: 'hidden' }}
                    placeholder="写一些介绍,能帮助读者快速把握书籍的内容."
                    autoSize={{ minRows: 6, maxRows: 1000000 }}
                    showCount
                    maxLength={3000}
                  />
                ),
              });
            }}
          >
            <Badge dot={bookDesc} offset={[8,0]}>添加简介</Badge>
          </Button>
        </Col>
        <Col span={6}>
          <Popconfirm
            title="确认发布你的书籍吗?"
            onConfirm={() => {
              request.post(apis.publish_book)
                .send({
                  user: login_info().user,
                  book_name: bookName,
                  book_body: bookBody,
                  book_desc: bookDesc,
                  book_cover: bookCoverUrl,
                })
                .then(res => {
                  if (res.body.status === 'success') {
                    message.success('发布成功, 即将跳转至书籍.');
                    setTimeout(() => window.location.href = '/book?book_id='+res.body.book_id, 1000);
                  } else {
                    message.error('书名已被使用已存在.');
                  }
                })
                .catch(err => message.error(err.response.text.slice(1, -1)));
            }}
            okText="确认"
            cancelText="再想想"
            disabled={!(bookName && bookBody)}
          >
            <Button
              type="primary" shape="round"
              style={btn_style}
              onClick={() => !(bookName && bookBody) && message.error('书籍名称和内容不能为空.')}
            >
              发布
            </Button>
          </Popconfirm>
        </Col>
      </Row>

      <div
        style={{
          width: 1090,
          margin: '0 auto',
        }}
      >
        <MarkdownEditor
          height={600}
          onChange={(editor, data, value) => setBookBody(value)}
          visible={true}
        />
      </div>

      <Modal
        title="为书籍上传封面:"
        closable={true}
        maskClosable={true}
        visible={coverModelShow}
        onCancel={() => setCoverModelShow(false)}
        onOk={() => setCoverModelShow(false)}
      >
        <ImgCrop rotate aspect={0.84}>
          <Upload
            action={apis.publish_book}
            listType="picture-card"
            onChange={({ file }) => setBookCoverUrl(file.response)}
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
            + 上传封面
          </Upload>
        </ImgCrop>
      </Modal>
    </>
  );
}

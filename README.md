# 基于Web的跨平台电子书籍创作订阅系统的设计与实现

> 作者联系方式:
> - QQ: 839379037
> - 微信: 13485336343
> - 欢迎有兴趣的人来交流

## 预览图片

- 网站预览截图放在`sitePreviewImage`目录下,可下载后查看

## 部署项目
### 环境依赖
- Python - 3.8.5
- Node.js - v14.16.1 - `http://nodejs.cn/download/`

### 拉取项目源码
```bash
git clone git@github.com:smartGrey/booksys.git
```

### 部署/启动前端
```bash
cd booksys/frontend
npm config set registry https://registry.npm.taobao.org
npm install
npm start
# http://127.0.0.1:8000/
```

### 部署/启动后端
```bash
cd booksys/
python3 -m venv booksys-env
source booksys-env/bin/activate
cd backend
pip install -r requirement.txt
python manage.py migrate
python manage.py runserver 8000
# http://127.0.0.1:8000/
```

### 后端常用操作
```bash
# 创建后台管理员
python manage.py createsuperuser
# 根据提示,输入用户名密码 admin 123456

# 直接访问数据库
python manage.py dbshell

# 直接访问包含当前 django 环境的 python shell
python manage.py shell

# 清空数据库
python manage.py migrate app(app的名字) zero
python manage.py flush
```



## 网站技术架构

- 前端-设计
    - 在 ppt 里设计
- 前端-开发
    - node-npm
    - react
    - ant -design
- 后端-设计
    - url 设计
- 后端-代码开发
    - python
    - django
    - 后台管理系统 - 由 django 迁移生成
- 后端-数据库开发
    - mysql
    - 由 django model迁移生成
- 前后端对接调试

## 主要功能点

- 用户管理
    - 登录
    - 注册
- 个人中心
    - 我的订阅
    - 我的创作
    - 我的消息
    - 我的收藏
    - 我的关注
    - 我的点赞
    - 个人信息
    - 最近阅读
- 搜索
- 写作
    - 编辑器https://uiwjs.github.io/react-markdown-editor/
        - https://codingdict.com/os/software/51495
        - https://www.npmjs.com/package/react-markdown
    - 发表
    - 删除
- 阅读书籍页
    - 订阅
    - 点赞
    - 留言
    - （订阅数量）

## 数据库设计

### 用户表

- id
- 用户名
- 密码
- 创建日期
- 性别
- 头像url
- 个性签名、作者简介

### 书籍表

- id
- 书名
- 外键 - 作者 - 用户 id
- 正文（markdown 格式）
- 发布时间
- 字数
- 封面 url
- 简介

### 收藏表

- id
- 外键 - 书籍 - 书籍 id
- 外键 - 订阅用户 - 用户 id

### 评论表

- id
- 外键 - 书籍 - 书籍 id
- 留言时间
- 留言内容
- 外键 - 留言用户 - 用户 id

### 书籍点赞表

- id
- 外键 - 书籍 - 书籍 id
- 外键 - 留言用户 - 用户 id

### 作者关注表

- id
- 外键 - 关注用户 - 用户 id
- 外键 - 被关注用户 - 用户 id

### 消息表

- id
- 外键 - 接收用户 - 用户 id
- 创建时间
- 消息标题
- 消息内容
- 是否已读

### 阅读记录

- id
- 外键 - 阅读用户 - 用户 id
- 外键 - 阅读书籍 - 书籍 id
- 阅读时间

### 推荐书单

- id
- 外键 - 书籍 - 书籍 id

## UI 设计

- 主要颜色
    - 深青色 - 47,79,79
    - 中青色 - 72,209,204
    - 亮青色 - 0,255,255
    - 深蓝色 - 32,66,86

## 术语

- 电子书 - book
- 想看 - list_to_read
- 点赞 - like
- 关注 - favor
- 创作 - write
- 作者 - author
- 创建时间 - create_time
- 性别 - gender
- 头像 - profile_photo
- 个性签名 - description
- 正文 - body

## 前端 URL 设计

- / - 首页
- /write - 创作
- /login - 登录
- /sign_in - 注册
- /search?keyword=xxx - 搜索
- /user?user=xxx - 用户中心
- /book?book=bookidxxx - 书籍阅读
- /admin - 管理员页面

# 毕业设计 - 基于Web的跨平台电子书籍创作订阅系统的设计与实现


## 环境依赖
- Python - 3.8.5
- Node.js - v14.16.1 - `http://nodejs.cn/download/`

## 部署项目

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

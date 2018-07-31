# commonService2.0 说明文档
基于meanjs 0.5.0版开发
## 基本运行环境
Node.js ~6.11.0 (6.11.4)

Angular ~1.5.0 (1.5.11)

---

## 基础模块
core, config, message, auth模块是必须模块，其他模块根据需求添加，默认依赖必须模块。

- *core* (required) - 此模块是核心模块，也是整个项目的入口。
    - *client*
        - *app*
            - *config.js* - angular项目基础也来配置，添加注册模块方法
            - *init.js* - 启动angular项目
        - *config*
            -  *core.client.http.js* - 设置http请求头的一些默认信息
            -  core.client.route-filter.js - 路由跳转时的权限控制和储存previousState
            -  *core.client.routes.js* - 前端dashboard、未找到页面、无效请求、没有权限页面路由设置, 路由格式的处理
        - *controller*
            - *dashboard.client.controller.js* - 初始化dashboard列表
            - *error.client.controller.js* - 错误处理
        - *css* - bootstrap-theme 样式引入，和初始化css  
        - *directives* - 通用的directives
        - *fonts* - 引入字体
        - *img* - logo图片, favicon图片, no-image图片
        - *scss* - dashboard, error页面样式
        - *services*
            - *interceptor*
                - *error.interceptor.client.service.js* - 错误拦截
        - *views* - 前端基础模板，及错误页面
    - *server*
        - *controllers*
            - 后端错误处理，渲染模板页面
        - *routes*
            - 根路由，错误路由  
        - *views*
            - 后端错误页面和模板页面
- *config* (required)
    - 配置系统菜单项
    - 预留接口，方便其他模块添加全局配置项 
- *message* (required)
    - 全局消息增删改查
    - 前端notification service控制前端的消息提醒 （notification.client.service.js - alert提醒和confirm弹窗）
- *auth* (required)
    - 管理员登录，登出，修改密码
- *client*
    - 第三方client key的管理
    - basic认证
- *email*
    - 全局邮件模板增删改查 （模板引擎使用handlebar）及测试邮件发送
    - 系统邮件发送，预留内部公用方法给其他模块 （如staff，user模块的用户操作通知邮件）
    - 预留public api，用于邮件发送
- *staff* (依赖 email 模块)
    - 管理员的增删改查，权限设置
- *user* (依赖 client, email 模块)
    - 平台业务模块的用户管理 （用户基本信息，密码管理）
    - 提供用户oauth登录 （Bearer认证）
- *file*
    - 基本文件上传下载及基础管理
- *feedback*
    - 项目页面错误收集
    - 提供public api，收集其他客户端反馈或者错误
- *localization*
    - 多语言模块

---

## 2.0版本的改进 

模块更加的分离，具体如下:
1. 分离之前的auth模块为auth, staff, user模块
2. 添加了message模块进行消息控制
3. 核心模块有core, config, auth, message

### 2. 依赖升级

2.0中相对于1.0的npm package进行了一定的升级，使package的使用更加方便

### 3. gulp

在common-service1.0中使用gulp进行前端自动化配置，2.0中将废弃grunt，采用gulp进行配置

### 4. 前端模板缓存

通过模板缓存的方法减少了前端页面的请求

### 5. 代码优化

1. 后端代码采用了es6的一部分写法，主要包括：
    * 变量声明使用`const`和`let`
    * 用箭头函数取代function声明的方式
2. model的写法进行了较大的改进：
    *  采用`schema`的`timestamps`的参数代替原来的钩子函数中的手动添加`undated`和`created`属性
    *  使用mongoose插件，现在已经使用的插件只有`mongoosePaginate`
    *  取消了原来的load和loadAll方法
    *  添加静态方法 get(id)
3. 使用$resource向后端发起请求
4. 前端controller代码进行了规范化
    * 变量挂载到this上，停止使用$scope
    * 变量声明集中放置在controller最前边
    * 采用$inject进行依赖注入
5. 风格统一
    * 代码风格更加统一规范，具体参照common-service的前后端规范
6. 移除无用代码和依赖


### 6. 消息提醒
1. 1.0中通过将确认模态框放在rootScope上的做法，在2.0中采用notification Service.有show, confirm, load三种方法
2. 1.0中将message数据作为静态数据放在后端response.js文件中，2.0中的message数据放在数据库中，通过message模块进行控制，消息的具体数据在前端message页面进行编辑
3. 通过load方法可以获取数据库的message数据并存储在前端


---
## 项目依赖 
### 后端项目依赖
1. **acl**: 访问控制,跟我们每个模块下设置的的policy相关，更多细节请移步[github地址](https://github.com/optimalbits/node_acl)
2. **async**: 异步流程控制，更多细节请移步[github地址](https://github.com/caolan/async)或[官方网站](http://caolan.github.io/async/)
3. **azure-storage**: Microsoft Azure Storage SDK for Node.js，更多细节请移步[github地址](https://github.com/Azure/azure-storage-node)或[官方网站](http://azure.github.io/azure-storage-node/)
4. **body-parser**: Parse incoming request bodies in a middleware before your handlers, available under the req.body property.，更多细节请移步[github地址](https://github.com/expressjs/body-parser)
5. **chalk**: 很方便的修改控制台输出文字的样式，更多细节请移步[github地址](https://github.com/chalk/chalk)
6. **compression**: 对响应请求压缩,可以减少一部分的网络传输，更多细节请移步[github地址](https://github.com/expressjs/compression)
7. **connect-mongo**: MongoDB session store for Connect and Express，更多细节请移步[github地址](https://github.com/jdesboeufs/connect-mongo)
8. **cookie-parser**: Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.，更多细节请移步[github地址](https://github.com/expressjs/cookie-parser)
9. **cron**: 自动任务处理插件，更多细节请移步[github地址](https://github.com/merencia/node-cron)或[官方网站](http://merencia.com/node-cron/)
10. **dotenv**: 把我们在.env文件里的环境变量加载到process.env，更多细节请移步[github地址](https://github.com/motdotla/dotenv)
11. **express**: 后端框架，meanjs中的e说的就是express，更多细节请移步[github地址](https://github.com/expressjs/express)或[官方网站](https://expressjs.com/)
12. **express-hbs**: express 模板引擎，更多细节请移步[github地址](https://github.com/barc/express-hbs)
13. **express-session**: express session中间件，更多细节请移步[github地址](https://github.com/expressjs/session)
14. **express-validator**: express validator中间件，可以用来检查请求参数是否有效，更多细节请移步[github地址](https://github.com/ctavan/express-validator)
15. **express-winston**: express写日志的中间件，github上面有官网地址，但是打开后显示无效网址，更多细节请移步[github地址](https://github.com/bithavoc/express-winston)
16. **formidable**: 用于解析表单数据，特别是文件上传，更多细节请移步[github地址](https://github.com/felixge/node-formidable)
17. **glob**: 用于文件匹配，更多细节请移步[github地址](https://github.com/isaacs/node-glob)
18. **handlebars**: 后端模板渲染引擎，更多细节请移步[github地址](https://github.com/wycats/handlebars.js)或[官方网站](http://handlebarsjs.com/)
19. **helmet**: 通过设置http请求头来保护应用程序的安全，更多细节请移步[github地址](https://github.com/helmetjs/helmet)或[官方网站](https://helmetjs.github.io/)
20. **lodash**: 常用js方法库，更多细节请移步[github地址](https://github.com/lodash/lodash/)或[官方网站](https://lodash.com/)
21. **lusca**: 可以使用这个库来进行一些程序安全相关的设置，更多细节请移步[github地址](https://github.com/krakenjs/lusca)
22. **mailgun-js**: mailgun的sdk，和邮件接收与发送相关，更多细节请移步[github地址](https://github.com/bojand/mailgun-js)或[官方网站](http://bojand.github.io/mailgun-js)
23. **method-override**: 在客户端不支持的地方使用HTTP动词，如PUT或DELETE，更多细节请移步[github地址](https://github.com/expressjs/method-override)
24. **mongoose**: MongoDB的sdk，用于各种数据库相关的操作，更多细节请移步[github地址](https://github.com/Automattic/mongoose)或[官方网站](http://mongoosejs.com/)
25. **mongoose-paginate**: mongoose分页插件，更多细节请移步[github地址](https://github.com/edwardhotchkiss/mongoose-paginate)
26. **morgan**: 记录各种http请求，在控制台看到的那些http请求记录就靠他了，更多细节请移步[github地址](https://github.com/expressjs/morgan)
27. **multer**: 用于操作multipart/form-data的Node.js中间件。multipart/form-data是什么？你还记得html中form有个enctype属性吗，它的可取值中就有multipart/form-data，更多细节请移步[github地址](https://github.com/expressjs/multer)
28. **oauth2orize**: oauth 2 认证工具集，在user登陆的时候或者刷新token的时候用到的，更多细节请移步[github地址](https://github.com/jaredhanson/oauth2orize)
29. **passport**: nodejs认证中间件，更多细节请移步[github地址](https://github.com/jaredhanson/passport)或[官方网站](http://www.passportjs.org/)
30. **passport-http**: basic认证中间件，更多细节请移步[github地址](https://github.com/jaredhanson/passport-http)
31. **passport-http-bearer**: bearer认证中间件，更多细节请移步[github地址](https://github.com/jaredhanson/passport-http-bearer)
32. **passport-local**: Passport strategy for authenticating with a username and password.，更多细节请移步[github地址](https://github.com/jaredhanson/passport-local)
33. **response-time**: 这个是一个记录HTTP服务器中的请求响应时间的中间件。 “响应时间”在这里定义为从请求进入这个中间件到写出到客户端的时间经过的时间。，更多细节请移步[github地址](https://github.com/expressjs/response-time)
34. **serve-favicon**: 设置favicon的中间件，具体在express配置中有用到，更多细节请移步[github地址](https://github.com/expressjs/serve-favicon)
35. **validator**: 进行字符串验证的一个插件，更多细节请移步[github地址](https://github.com/chriso/validator.js)
36. **winston**: 日志记录插件，更多细节请移步[github地址](https://github.com/winstonjs/winston)或[官方网站](http://github.com/winstonjs/winston)
37. **winston-daily-rotate-file**: log文件夹下每天都会有一个新的log文件生成，这是怎么来的呢，靠他了，更多细节请移步[github地址](https://github.com/winstonjs/winston-daily-rotate-file)

### 后端开发依赖
1. **bower**: 前端包管理工具，更多细节请移步[github地址](https://github.com/bower/bower)或[官方网站](https://bower.io)
2. **eslint**: js代码检测工具，更多细节请移步[github地址](https://github.com/eslint/eslint)或[官方网站](https://eslint.org/)
3. **eslint-config-airbnb**: js代码风格指南，更多细节请移步[github地址](https://github.com/airbnb/javascript)
4. **gulp**: 自动化编译工具，更多细节请移步[github地址](https://github.com/gulpjs/gulp)或[官方网站](http://gulpjs.com/)
5. **gulp-autoprefixer**: 自动给css加指定版本的浏览器前缀，这就是我们使用大部分css新属性时不需要考虑浏览器兼容的原因，更多细节请移步[github地址](https://github.com/sindresorhus/gulp-autoprefixer)
6. **gulp-concat**: gulp流合并中间件，常用来进行文件合并，更多细节请移步[github地址](https://github.com/contra/gulp-concat)
7. **gulp-csslint**: gulp css代码规范检查插件，更多细节请移步[github地址](https://github.com/lazd/gulp-csslint)
8. **gulp-eslint**: gulp js代码规范检查插件，更多细节请移步[github地址](https://github.com/adametry/gulp-eslint)
9. **gulp-load-plugins**: 自动加载gulp插件的插件，这就是我们明明装了很多的gulp中间件，但是在gulp.js中却只加载了很少一部分gulp插件的原因，更多细节请移步[github地址](https://github.com/jackfranklin/gulp-load-plugins)或[官方网站](https://github.com/jackfranklin/gulp-load-plugins)
10. **gulp-nodemon**: gulp的[nodemon](https://github.com/remy/nodemon)插件，nodemon是用来监视我们的文件是否有改动的一个包，gulp-nodemon依赖于原始的nodemon，更多细节请移步[github地址](https://github.com/JacksonGariety/gulp-nodemon)
11. **gulp-refresh**: 如果我们的项目文件有所更改，这个插件会为我们自动刷新浏览器，更多细节请移步[github地址](https://github.com/leo/gulp-refresh)或[官方网站](https://npmjs.com/package/gulp-refresh)
13. **gulp-sass**: 编译sass文件的插件，更多细节请移步[github地址](https://github.com/dlmanning/gulp-sass)
14. **open**: 控制台输入一个gulp，最后浏览器里打开了我们本地的server地址，怎么做到到？靠它了！，更多细节请移步[github地址](https://github.com/sindresorhus/opn)
15. **run-sequence**: 让gulp按照顺序执行任务，更多细节请移步[github地址](https://github.com/OverZealous/run-sequence)

### 前端依赖
1. **angular**: 前端主框架，我们项目中使用的版本是1.5.x，更多细节请移步[github地址](https://github.com/angular/angular.js)或[官方网站](https://angularjs.org)
2. **angular-animate**: Angularjs的动画模块，更多细节请移步[github地址](https://github.com/angular/angular.js)或[官方网站](https://angularjs.org)
3. **angular-bootstrap**: 纯AngularJS编写的Bootstrap组件，更多细节请移步[github地址](https://github.com/angular-ui/bootstrap/)或[官方网站](http://angular-ui.github.io/bootstrap/)
4. **angular-messages**: AngularJS模块为模板中的消息显示提供增强的支持，更多细节请移步[github地址](https://github.com/angular/angular.js)或[官方网站](http://angularjs.org)
5. **angular-resource**: AngularJS模块用于与RESTful服务器端数据源进行交互，更多细节请移步[github地址](https://github.com/angular/angular.js)或[官方网站](http://angularjs.org)
6. **angular-ui-router**: angular前端路由管理模块，更多细节请移步[github地址](https://github.com/angular-ui/ui-router)或[官方网站](https://travis-ci.org/angular-ui/ui-router)
7. **bootstrap**: 前端基础样式框架，更多细节请移步[github地址](https://github.com/twbs/bootstrap)或[官方网站](https://getbootstrap.com/docs/3.3/)
8. **ng-sortable**: angular拖拽排序插件，更多细节请移步[github地址](https://github.com/a5hik/ng-sortable)或[官方网站](http://a5hik.github.io/ng-sortable/)
9. **textAngular**: angular富文本编辑插件，更多细节请移步[github地址](https://github.com/textAngular/textAngular)或[官方网站](http://www.textangular.com/)
10. **ng-flow**: angular前端文件上传插件，这个只是对flow.js做了一些封装，更多细节请移步[github地址](https://github.com/flowjs/ng-flow)或[官方网站](http://flowjs.github.io/ng-flow/)


---
## 代码文件结构 
### 整体结构
- *config* - 配置项目运行时的各种变量及函数。主要包括开发环境、生产环境、测试环境的配置信息及应用本身的配置，比如express的配置。
    - *assets* - 配置项目运行需要的资源地址（包括img, css, js, html templates）。此外，根据项目运行的环境（如dev, test, prod），个别特定资源可能会有不同的变化。其基本作用是告诉应用程序在哪里可以找到需要的资源文件。
        - *default.js*
            - client - 端配置lib（css、js），css，sass，font，js，img，views，templates
            - server - 端配置gulpConfig，allJS，models，routes，APIRoutes，config，policies，views
        - *development.js* - 开发环境的配置
        - *production.js* - 生产环境的配置，client端配置lib（css，js），css，js
        - *test.js* - 测试环境的配置，tests端配置client，server，e2e
        - *uat.js* - uat环境的配置，client端配置lib（css，js），css，js
    - *env* - 环境变量的配置。
        - *default.js* - 默认环境变量
        - *development.js* - 扩展了开发环境的环境变量
        - *production.js* - 扩展了生产环境的环境变量
        - *sit.js* - 扩展了sit环境的环境变量
        - *uat.js* - 扩展了uat环境的环境变量
        - *test.js* - 扩展了test环境的环境变量
    - *lib* - 初始化和启动项目
        - *APIError.js* - 初始化 Error 类
        - *app.js* - 项目启动
        - *auth.js* - 初始化权限验证，提供权限验证接口。
        - *cronJobs.js* - 启动自动化任务。
        - *express.js* - express配置
            - const app = express();
            - this.initLocalVariables(app); 初始化本地变量
            - this.initMiddleware(app); 初始化应用程序中间件
            - this.initViewEngine(app); 初始化模版引擎
            - this.initSession(app, db); 初始化session
            - this.initModulesConfiguration(app); 初始化模块配置
            - this.initHelmetHeaders(app); 初始化安全配置
            - this.initModulesClientRoutes(app); 初始化模块静态客户端路由
            - this.initModulesServerPolicies(app); 初始化模块服务器授权策略
            - this.initPublicAPIRoutes(app); 初始化公共 API 路由
            - this.initModulesServerRoutes(app); 初始化模块服务器路由
            - this.initErrorRoutes(app); 初始化错误路由
        - *mongoose.js* - 数据库相关接口
        - *response.js* - 消息封装接口
    - *config.js* - 初始化全局配置文件
- *logs* - 记录log的文件夹
- *migration*
    - *config.json* - config种子数据
    - *messages.json* - message种子数据
    - *migUtils.js* - 脚本运行接口
    - *seed.js* - 初始化messages,config,email等种子数据接口
- *modules* 
    - *modules/\*/client* - 与特定模块相关的客户端代码和相关文件。
    - *modules/\*/server* - 与特定模块相关的服务器端代码和相关文件。
    - *modules/\*/tests* - 用于验证模块相关的代码和相关文件。
- *public*
    - *lib* - 应用程序使用的外部插件库
- *.bowerrc* - bower配置文件
- *.csslintrc* - CSSLint规则的配置文件。规则详细https://github.com/CSSLint/csslint/wiki/Rules
- *.editorconfig* - editorconfig帮助开发人员在不同的编辑器和IDE之间定义和维护一致的编码风格。网址http://editorconfig.org/
- *.env* - 开发环境变量的配置
- *.env-example* - 开发模式使用的系统变量（例子）
- *.eslintrc.js* - ESLint规则的配置文件。规则详细https://eslint.org/docs/rules/
- *.gitignore* - 一般来说每个Git项目中都需要一个“.gitignore”文件，这个文件的作用就是告诉Git哪些文件不需要添加到版本管理中。实际项目中，很多文件都是不需要版本管理的。这个文件的内容是一些规则，Git会根据这些规则来判断是否将文件添加到版本控制中。
- *bower.json* - 前端依赖管理的配置文件
- *gulpfile.js* - gulp的配置文件
- *package.json* - node依赖包管理文件
- *package-lock.json* 
    - package-lock.json是当 node_modules 或 package.json 发生变化时自动生成的文件。这个文件主要功能是确定当前安装的包的依赖，以便后续重新安装的时候生成相同的依赖，而忽略项目开发过程中有些依赖已经发生的更新。
    - npm 5.0新增特性。如果package.json中使用了~或^指定版本，在重新npm i时会安装可用的最新版本，同时package-lock.json也会改变。但是如果之前的版本固定，package-lock.json也会固定。
    - 忽略项目开发过程中有些依赖已经发生的更新而锁定当前项目所有依赖包的版本号，避免后来者新拉项目时因重新安装的依赖包版本不同而出现bug。
- *README.md* - 项目说明文档，markdown格式
- *server.js* - 项目启动文件

### 前端结构
- *client* 
    - *config* - 模块配置文件，包括路由配置和其他配置
    - *controllers* - 模块中使用的AngularJS控制器
    - *css* - 模块中使用的css文件
    - *directives* - 模块自定义AngularJS指令
    - *fonts* - 项目中使用的字体文件
    - *img* - 模块中使用的图片
    - *scss* - 模块中使用的scss样式文件和gulp编译后的css文件
    - *services* - 模块中配置的的angular服务
    - *views* - 前端模板文件


### 后端结构
- *service* 
    - *apiRoutes* - 模块中公共API
    - *config* - 模块中配置文件
    - *controllers* - 模块中使用的功能函数
    - *models* - 定义Shema
    - *policies* - 定义角色权限
    - *routes* - 内部路由文件

---

## 配置详细介绍 
### gulp配置
此处关于gulp的基本配置及语法不在赘述，详情请参阅[gulp官方文档](https://github.com/gulpjs/gulp/blob/master/docs/API.md)。    
一般情况下，gulpfile.js中的模块需要逐一加载。

```
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('js', function () {
   return gulp.src('js/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('build'));
});
```
类似以上代码，除了gulp以外还需要加载其他相关的模块。    
这种写法比较麻烦，[gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins)模块可以加载package.json文件中所有的gulp模块。假设我们package.json中有如下依赖模块：    

```
 "devDependencies": {
    "bower": "~1.8.0",
    "eslint": "~2.2.0",
    "eslint-config-airbnb": "~6.0.2",
    "gulp": "~3.9.1",
    "gulp-autoprefixer": "~4.0.0",
    "gulp-concat": "~2.6.0",
    "gulp-csslint": "~1.0.0",
    "gulp-eslint": "~3.0.1",
    "gulp-load-plugins": "~1.5.0",
    "gulp-nodemon": "~2.2.1",
    "gulp-refresh": "~1.1.0",
    "gulp-rename": "~1.2.2",
    "gulp-sass": "~3.1.0",
    "open": "0.0.5",
    "run-sequence": "^2.2.0"
  }
```
我们在调用相关模块时，可以写成：    
```
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

gulp.task('xxx', function () {
   return gulp.src('xxx/*.xx')
      .pipe(plugins.sass())
      .pipe(plugins.autoprefixer())
      .pipe(plugins.csslint('.csslintrc'))
      .pipe(plugins.csslint.formatter());
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format());
      ...
});
```


### 1.sass
当前浏览器不直接支持sass，因为我们需要[gulp-sass](https://github.com/dlmanning/gulp-sass)模块将其编译成浏览器支持的css。    
在我们的代码中：
```
gulp.task('sass', () => {
  return gulp.src(defaultAssets.client.sass)
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest('modules'));
});
```
- **gulp.src**：获取需要编译的scss文件路径，代码中“defaultAssets.client.sass”会在接下来的静态资源配置中讲到。其中路径为“modules/*/client/scss/\*.scss”，既每个module中前端的scss文件。    
- **plugins.sass**：调用编译scss方法。        
- **gulp.dest**：定义编译后的css文件存放的位置。    
- **plugins.autoprefixer**：我们在编写代码时，有时候要手动添加各个浏览器的前缀，如“-webkit-”等前缀。gulp-autoprefixer模块可以在编译scss时，为相关的样式属性添加浏览器前缀。


### 2.lint
#### （1）csslint   
[CSS Lint](https://github.com/CSSLint/csslint)是一个开源的CSS代码质量检查工具。项目中使用[gulp-csslint](https://github.com/lazd/gulp-csslint)模块来进行CSS文件代码检测。
在介绍gulp-csslint模块前，我们先要了解项目根目录中的.csslintrc文件。    
在进行CSS代码质量检查前，首先需要配置检查的规则，而.csslintrc文件就是用来配置检查规则的。项目中使用的配置如下：

```
{
  "adjoining-classes": false,  // 是否使用相邻选择器，如.a.b{}
  "box-model": false,  // 设置width或height的同时，还设置为border或padding，则必须设置box-sizing
  "box-sizing": false,  // box-sizing不要与相关属性同用
  "floats": false,  // 不要超过10次的浮动
  "font-sizes": false,  // 不要超过10次的font-size
  "important": false,  // 不使用!important
  "known-properties": false,  // 不允许使用不识别的样式属性
  "overqualified-elements": false,  // 使用相邻选择器时，不要使用不必要的选择器
  "qualified-headings": false,  // <h1>~<h6>应该被设置为顶级样式，如.test h3{}会提示警告，而
  "regex-selectors": false, // 禁止使用属性选择器中的正则表达式选择器
  "unique-headings": false, // 当多个规则定义针对同一标题的属性时，会出现警告
  "universal-selector": false, // 禁止使用通用选择器
  "unqualified-attributes": false // 禁止使用不同规范的属性选择器
}
```
gulp中csslint的配置：
```
gulp.task('csslint', () => {
    return gulp.src(defaultAssets.client.css)
        .pipe(plugins.csslint('.csslintrc'))
        .pipe(plugins.csslint.formatter());
});
```
**gulp.src**：获取需要检查的css文件路径。其路径为：    

```
 css: [
            'modules/core/client/css/bootstrap-theme.css',
            'modules/core/client/css/main.css',
            'modules/*/client/{css,less,scss}/*.css'
        ]
```
既bootstrap的主题样式文件，core模块中通用的main.css文件以及针对各个模块中编译生成的css文件。    
- **plugins.csslint('.csslintrc')**：加载定制化的语法检查规则。   
- **plugins.csslint.formatter()**：调用csslint中的内置格式化程序，并输出检查结果。

    
#### （2）eslint
[ESLint](https://eslint.org/)是在ECMAScript/Javascript代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。在介绍gulp-eslint之前，我们首先需要了解项目中的.eslintrc.js文件。    
.eslintrc.js文件是项目中的eslint代码检查的配置文件，它支持几种格式，同一个目录下有多个配置文件，ESLint只会使用一个，并且优先级顺序如下：
1. JavaScript - 使用.eslintrc.js然后输出一个配置对象；
2. YAML - 使用.eslintrc.yaml或者eslintrc.yml去定义配置的结构；
3. JSON - 使用.eslintrc.json去定义配置的结构，ESLint的JSON文件允许JavaScript风格的注释；
4. Deprecated - 使用.eslintrc，可以是JSON也可以是YAML;
5. package.json - 在package.json里创建一个eslintConfig属性，在那里定义你的配置。 

以下是项目中的配置规则：

```
module.exports = {
  extends: [
    'airbnb/legacy'
  ],
  rules: {
    camelcase: 0,
    'comma-dangle': [2, 'never'],
    'comma-spacing': [2, {before: false, after: true}],
    'consistent-return': 0,
    curly: 0,
    'default-case': 0,
    eqeqeq: [2, 'smart'],
    'func-names': 0,
    'guard-for-in': 2,
    'dot-notation': 1,
    indent: [2, 4, {SwitchCase: 1}],
    'key-spacing': [2, {beforeColon: false, afterColon: true}],
    'keyword-spacing': [2, {before: true, after: true}],
    'max-len': 0,
    'new-cap': [2, {newIsCapExceptions: ['acl.memoryBackend', 'acl'], capIsNewExceptions: ['express.Router']}],
    'no-bitwise': 0,
    'no-caller': 2,
    'no-console': 0,
    'no-else-return': 0,
    'no-empty-class': 0,
    'no-multi-spaces': 2,
    'no-nested-ternary': 1,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'no-spaced-func': 2,
    'no-throw-literal': 2,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-unneeded-ternary': 2,
    'no-unreachable': 2,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': 0,
    'no-use-before-define': [1, 'nofunc'],
    'no-var': 0,
    'object-curly-spacing': 0,
    'one-var': [0, 'never'],
    'one-var-declaration-per-line': [2, 'always'],
    'padded-blocks': 0,
    'space-before-function-paren': [2, {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'space-in-parens': [2, 'never'],
    'spaced-comment': [2, 'always'],
    strict: 0,
    'quote-props': 0,
    quotes: [1, 'single'],
    'wrap-iife': [2, 'outside'],
    'vars-on-top': 0
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    jasmine: true,
    mocha: true,
    jquery: true
  },
  globals: {
    angular: true,
    by: true,
    browser: true,
    element: true,
    inject: true,
    io: true,
    moment: true,
    Modernizr: true,
    Promise: true,
    __TESTING__: true,
    _: false,
    ApplicationConfiguration: true
  }
};
```
关于其中的每一项配置详情，可以参考[ESLint-Rules](https://eslint.org/docs/rules/)。    
项目中关于gulp-eslint的代码如下：

```
gulp.task('eslint', () => {
    let assets = _.union(
        defaultAssets.server.gulpConfig,
        defaultAssets.server.allJS,
        defaultAssets.client.js
    );
    return gulp.src(assets)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format());
});
```
- **gulp.src**：获取需要检查的js文件路径，代码证使用了[lodash.union](https://lodash.com/docs/4.17.4#union)方法，对项目中不同路径的js文件路径进行了封装。    
- **plugins.eslint**：调用eslint方法，执行语法检查；    
- **plugins.eslint.format**：调用格式化方法，输出检查结果到控制台。     

### 3.watch    
我们在编辑Javascript,HTML以及sass，less等文件时，很多时候在编写完成后需要立即编译文件，然后从编译器切换到浏览器，再刷新浏览器才能看到页面变化，所以首先我们需要监听相关文件变化从而执行对应的事件。[gulp-watch](https://www.npmjs.com/package/gulp-watch)就为我们提供了监听文件的功能，而[Livereload](http://livereload.com/)可以帮助我们解决自动刷新问题。    
实现Livereload有很多种方式，项目中使用[gulp-refresh](https://www.npmjs.com/package/gulp-refresh)来实现。
项目中关于watch的代码如下：

```
gulp.task('watch', () => {
    plugins.refresh.listen();
    gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.server.allJS).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.client.js).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.client.css).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.client.sass, ['sass']).on('change', plugins.refresh.changed);
    gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
});
```
- **plugins.refresh.listen**：启动一个livereload服务；    
- **gulp.watch**：创建一个监听器来监听对应路径的文件是否变化，若发生变化，则调用refresh.changed事件；    
- **refresh.changed**：将文件的变化发送给livereload服务。

### 4.nodemon 
[gulp-nodemon](https://www.npmjs.com/package/gulp-nodemon)包和npm包[nodemon](https://nodemon.io/)的功能差不多一样，只是支持了与gulp的结合。根据npm包nodemon 官网的介绍，nodemon 的作用类似于 node。我们通常在命令行中输入 node  server.js就能启动某个本地的服务器。如果我们输入 nodemon server.js同样也能启动。不同的是，nodemon能够检测 server.js 所在目录下的文件，如果有改变，就会自动重新启动 server.js。而gulp-nodemon 包的使用也类似的，代码如下：

```
gulp.task('nodemon', () => {
    return plugins.nodemon({
        script: 'server.js',
        ext: 'js,html',
        verbose: true,
        tasks: ['eslint'],
        watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
    })
        .on('config:update', () => {
            let config = require('./config/config');
            setTimeout(() => {
                require('open')('http://localhost:' + config.port);
            }, 3000);
        })
        .on('restart', () => {
            setTimeout(() => {
                require('fs').writeFileSync('.rebooted', 'rebooted');
            }, 2000);
        });
});
```
- **script**：设置本地服务的入口为根目录下的server.js文件；    
- **ext**：监听指定后缀名的文件，用空格间隔。默认监听的后缀文件：.js, .coffee, .litcoffee, .json；    
- **verbose**：为true表示输出详细的启动与重启信息；    
- **tasks**：在服务重启后要执行的任务；    
- **watch**：设置监听任务，监听服务端所有的view,js和配置文件；    
- **config:update**：nodemon提供一些内置[监听事件](https://github.com/remy/nodemon/blob/master/doc/events.md)，“config:update”为nodemon本身的配置只要改变就会触发，代码中当其配置改变后会重启服务并打开浏览器对应的端口；    
- **restart**：此事件进行重写根目录中的.rebooted文件，从而触发nodemon的watch事件进行服务重启。

### 5.其他
代码如下：

```
gulp.task('lint', (done) => {
    runSequence('sass', ['csslint', 'eslint'], done);
});
```
runSequence用于顺序执行任务，此代码先编译scss文件为css文件，然后执行csslint和eslint检查。

```
gulp.task('default', (done) => {
    runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});
```
default任务为gulp默认执行的任务，任务先设置环境变量为develop，然后进行lint语法检查，启动服务并实时监听相关文件。

### express配置
### 1.相关lib
[Express](http://expressjs.com/)是一个基于Node.js平台的极简、灵活的web应用开发框架，它提供一系列强大的特性，帮助你创建各种Web和移动设备应用。
项目中用到的配置包如下：
- [body-parser](https://github.com/expressjs/body-parser)： 用于解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理；
- [express-session](https://github.com/expressjs/session)：用指定的参数创建一个session中间件，sesison数据不是保存在cookie中，仅仅sessionID保存到cookie中，session的数据仅仅保存在服务器；
- [connect-mongo](https://github.com/jdesboeufs/connect-mongo): 用于将session存入mongo中；
- [serve-favicon](https://github.com/expressjs/serve-favicon/tree/master)：用于请求网页的logo；
- [response-time](https://github.com/expressjs/response-time)：该模块创建一个中间件，记录HTTP服务器中请求的响应时间。这里将“响应时间”定义为从请求进入此中间件到何时将标题写入客户端的时间；
- [method-override](https://github.com/expressjs/method-override)：在后端提供一个针对HTTP PUT的API， 前端的数据提交时，我们自然希望FORM能够产生一个PUT请求。然而，浏览器的FORM只能GET或者POST。怎么办？ 改变后端的API吗？如果这个API是别的服务商提供，我们无权更改呢？这时，我们就需要method-override来帮助我们；
- [cookie-parser](https://github.com/expressjs/cookie-parser): 一个解析Cookie的工具；
- [helmet](https://github.com/helmetjs/helmet)：一系列帮助增强Node.JS之Express/Connect等Javascript Web应用安全的中间件；
- [connect-flash](https://github.com/jaredhanson/connect-flash): 用于存储消息的会话的特殊区域。消息被写入闪存并在显示给用户后清除。闪存通常与重定向结合使用，确保消息可用于要呈现的下一页；
- [express-hbs](https://github.com/barc/express-hbs)：express handlebar模板引擎，用于后端渲染模板；
- [express-validator](https://github.com/ctavan/express-validator)： 数据存储数据库之前用于校验的中间件；
- [path](https://github.com/jinder/path)：path模块提供用于处理文件和目录路径的实用程序；
- [express-winston](https://github.com/bithavoc/express-winston)： node 日志管理；
- [lusca](https://github.com/krakenjs/lusca)：用于解决csrf，p3p,xframe,csp 等问题的中间件；

### 2.配置详情
项目的入口为根目录下的server.js文件，它会调用“config/lib/app.js”文件中的start方法从而初始化express配置(“express.init()”)。
在分析express的配置时，建议从文件最下面的init方法开始逐个阅读：

```
   // Initialize express app
    const app = express();

    // Initialize local variables
    this.initLocalVariables(app);

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize Express session
    this.initSession(app, db);

    // Initialize Modules configuration
    this.initModulesConfiguration(app);

    // Initialize Helmet security headers
    this.initHelmetHeaders(app);

    // Initialize modules static client routes
    this.initModulesClientRoutes(app);

    // Initialize modules server authorization policies
    this.initModulesServerPolicies(app);

    // Initialize public API routes
    this.initPublicAPIRoutes(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    // Initialize error routes
    this.initErrorRoutes(app);

    return app;
```

#### （1）initLocalVariables
initLocalVariables方法用于初始化本地全局变量，其中[app.locals](http://www.expressjs.com.cn/4x/api.html#app.locals)是一个Javascript对象，它的属性包含应用内的本地变量。函数中初始化了项目名称、描述、关键字和环境变量等属性。代码如下：

```
module.exports.initLocalVariables = function (app) {
    // Set environment
    app.set('env', config.env);

    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    ...
};
```
#### （2）initMiddleware
initMiddleware方法用于初始化各个中间件，其中包括初始化项目icon，环境变量等以上介绍的相关lib中间件。
#### （3）initViewEngine
initViewEngine方法用于初始化模板引擎。代码如下：

```
module.exports.initViewEngine = function (app) {
    app.engine('server.view.html', hbs.express4({
        extname: '.server.view.html'
    }));
    app.set('view engine', 'server.view.html');
    app.set('views', path.resolve('./'));
};
```
这里我们注册handlebar模板引擎渲染后缀名为“server.view.html”的文件，然后通过“app.set('view engine',     'server.view.html');”设置模板引擎。代码中“extname:'.server.view.html'”意为模板文件使用的后缀名为“.server.view.html”，这个名称为自定义，也可以使用“html”和“handlebars”等作为后缀。
#### （4） initSession
Internet通过协议氛围stateful和stateless两类，儿http是stateless协议，客户端发送请求到服务端建立一个链接，请求得到响应后链接立即中断，服务端不会记录状态，因此服务端想要确定是哪个客户端发来的请求，就必须要借助一些东西去完成，如session何cookies。    
session存在于服务器端，需要cookies协议才能完成，服务器端和客户端通过session id建立联系。express可以用中间件来使用session，express-session可以存在内存中，也可以存在mongodb、redis等中。    
代码如下：

```
module.exports.initSession = function (app, db) {
    // Express MongoDB session storage
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie: {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        },
        name: config.sessionKey,
        store: new MongoStore({
            db: db,
            collection: config.sessionCollection
        })
    }));

    // Add Lusca CSRF Middleware
    app.use(lusca(config.csrf));
};
```
- **saveUninitialized**：是否强制存储一个未初始化的session。默认值为true,但是默认值已经被弃用。项目中session与passport结合使用，所以passport将在session添加一个空的passport对象，以供用户验证之后使用。
- **resave**：是否强制将session存储于session存储区，及时sessio在请求期间从来没有被修改过。
- **secret**：用于注册一个sessionID。它可以是一个字符串或者是一个由多个secret组成的数组。
- **cookie.maxAge**：毫秒数，用于设置cookie的有效期。
- **cookie.httpOnly**：httpOnly的布尔值，设置为true时，客户端会不允许document.cookie查看cookie值。
- **cookie.secure**：设置Secure的布尔值，当设置为为true，如果浏览器没有HTTPS连接，客户端将不会将cookie发回服务端。
- **name**：设置响应sessionID的名字，默认值为“connect.sid”。
- **store**：session的实例，默认为MemoryStore实例。
- **lusca(config.csrf)**：传入csrf的配置，初始化lusca中间件。

#### （5）initModulesConfiguration
初始化各个模块的服务端配置。此方法用来加载各个模块的server端config文件。代码如下：

```
module.exports.initModulesConfiguration = function (app, db) {
    config.files.server.configs.forEach((configPath) => {
        require(path.resolve(configPath))(app, db);
    });
};
```
其中configPath为每个config文件的绝对路径，例如“modules/feedback/server/config/feedbacks.server.config.js”。

#### （6）initHelmetHeaders
配置helmet中间件。代码如下：

```
module.exports.initHelmetHeaders = function (app) {
    // six months expiration period specified in seconds
    const SIX_MONTHS = 15778476;
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubdomains: true,
        force: true
    }));
    app.disable('x-powered-by');
    app.use(helmet.hidePoweredBy({setTo: 'http://www.xxxxxx.com'}));
};
```
- **frameguard**：避免点击劫持攻击。
- **xssFilter**：增加XSS保护。
- **noSniff**：防止客户端发觉MIME类型。
- **ieNoOpen**：针对IE8+浏览器设置X-Download-Options。
- **hsts**：安全地设置HTTP严格传输协议。
- **hidePoweredBy**：隐藏powered-by并设置成需要的值。

#### （7）initModulesClientRoutes
加载前端路由文件以及设置静态文件夹路径。例如设置项目内部静态文件夹路径由'./public'为根目录以及全局的静态路由文件路径为“./modules/moduleName/client”。

#### （8）initModulesServerPolicies
初始化全局policy文件。方法中调用了authHelper中的init方法，代码如下：

```
exports.init = function () {
    // Using the memory backend
    config.files.server.policies.forEach(function (policyPath) {
        require(path.resolve(policyPath)).invokeRolesPolicies(acl);
    });
};
```
“config.files.server.policies”来自于config文件，即为每个模块中policy文件（“modules/*/server/policies/*.js”）里的invokeRolesPolicies方法注入[“acl”](https://github.com/OptimalBits/node_acl)中间件。

#### （9）initPublicAPIRoutes
配置所有为客户端提供的API，使其URL前缀添加'/api/base'。所有public API文件路径为：

```
APIRoutes: ['modules/core/server/apiRoutes/**/*.js', 'modules/!(core)/server/apiRoutes/**/*.js']
```
即所有模块中apiRoutes文件夹下的js文件。
在web端express中，使用[http-proxy](https://github.com/nodejitsu/node-http-proxy)进行代理设置，代码如下：

```
module.exports.initHttpProxy = function (app) {
    var httpProxy = require('http-proxy');

    var adminProxy = httpProxy.createProxyServer({
        target: config.adminHost,
        changeOrigin: true
    });

    app.all(["/api/base/*"], function (req, res) {
        console.log('entering api proxy to target', config.adminHost + req.path);
        adminProxy.web(req, res);
    });
};
```
在web端请求server端API时，所有API前需要添加'api/base',如：

```
this.findPassword = function (passwordInfo) {
    return $http.patch('/api/base/users/password/reset', passwordInfo);
};
```

#### （10） initModulesServerRoutes
加载所有模块中server端路由文件。

```
routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
```

#### （11） initErrorRoutes
配置错误处理的方法。首先初始化[“express-winston”](https://github.com/bithavoc/express-winston)中间件，使用“errorLogger”方法记录所有pipeline的错误日志。

```
app.use(expressWinston.errorLogger(config.logger));
```
方法中会判断错误类型为数据库内部错误还是在请求API时数据逻辑错误，这两种错误会分别调用response.js文件中的getMongoErrorMessage方法和getResponseData方法并以相应错误信息作为参数。如果不是以上这两种错误类型，则直接返回500错误。


### 环境变量配置
### 1. .env
Express的一个强大功能就是可以根据运行环境来配置应用，比如想在开发环境中启动日志系统，同时在生产环境中对相应的主体进行压缩等。  
为此我们就需要使用环境变量，说到环境变量，我们必须先要了解Node应用中的[process](https://nodejs.org/api/process.html#process_process)对象。[process.env](https://nodejs.org/api/process.html#process_process_env)属性会返回一个对象，包含了当前Shell的所有环境变量。比如，process.env.HOME返回用户的主目录。    
作为一个全局变量，process.env可以被用来访问预定义的环境变量。其中最常用的便是用NODE_ENV这个环境变量。NODE_ENV通常用于设置与环境有关的配置。在express中有如下配置：

```
if (process.env.NODE_ENV === 'development') {
    config.info('================> Applying Development Configurations');
    // Disable views cache
    app.set('view cache', false);
} else if (process.env.NODE_ENV === 'production') {
    config.info('================> Applying Production Configurations');
    app.locals.cache = 'memory';
}
```
上述代码使用了名为process.env.NODE_ENV的变量对系统环境进行判定。当系统环境是开发环境时，禁用静态页面缓存，当系统环境是生产环境时，则定义本地全局变量cache的值为“memory”。

项目中的环境变量，通常是为了一些通用的配置。如：

```
AZURE_STORAGE_ACCOUNT=educationaxisfiles
AZURE_STORAGE_ACCESS_KEY=GDomc+6a3q7O4I/I+e+4Qg1UYCliT5hd1IJsAOQd8TAk1CyPfWabNw5xJNXhQpyTndJWtRpgJurJz7SVg+0gvA==
AZURE_CONTAINER=mtu-test
DB_CONFIG_URI=mongodb://user:123gogogo@120.27.52.242:27758/common_service-dev
TEST_DB_CONFIG=mongodb://user:123gogogo@120.27.52.242:27758/common_service-test
MAIN_PAGE=modules/core/server/views/index
APP_TITLE=Common Service
APP_KEYWORDS=Common Service
APP_DESCRIPTION=Common Service
NODE_ENV=development
```
以上环境变量中包括Azure云存储的账户名和access key值，开发和测试的数据库URL以及项目描述等信息。一部分变量用于express的配置中，一部分变量用于某个模块的具体业务，如文件上传功能，还有一部分变量用于下面讲到的“config/env”目录下的环境配置文件。
### 2.config/env
config文件用于存放Express应用的配置文件。对于应用中的新增模块，每个模块都有一个对应的配置文件，这些配置文件都存放在该文件夹内。env文件夹用于存储以下Express应用环境配置文件：
- default.js
- development.js
- production.js
- sit.js
- test.js
- uat.js    

这里主要针对default文件和production文件进行对比。以下是default.js文件的代码：

```
module.exports = {
    app: {
        version: '2.0.0',  // 项目版本号
        title: process.env.APP_TITLE || 'commonServices', // 项目名称
        description: process.env.APP_DESCRIPTION || 'commonServices', // 项目描述
        keywords: process.env.APP_KEYWORDS || 'commonServices', // 项目关键字
        GTMTrackingID: process.env.GTM_TRACKING_ID // 部署Google Analytics时要用到的Tracking ID
    },
    copyright: process.env.APP_TITLE || 'CommonService', // 项目版权名称

    port: process.env.PORT || 7000,  // 开发环境中浏览器端口号
    host: process.env.HOST || '0.0.0.0', // 主机域名地址
    db: {  // mongoose 数据库配置
        promise: global.Promise,
        uri: process.env.DB_CONFIG_URI || 'mongodb://user:123gogogo@120.27.52.242:27758/common_service-dev',
        debug: process.env.MONGODB_DEBUG || false // 是否启用mongoose debug模式
    },
    sessionCookie: { // express中用于初始化express-session中间件的相关配置
        maxAge: 24 * (60 * 60 * 1000), // session有效时间默认24小时
        httpOnly: true, // 是否确保cookie只能通过HTTP协议访问，而不能通过JS浏览器直接访问
        secure: false // 是否只在HTTPS模式时设置cookie
    },
    sessionSecret: process.env.SESSION_SECRET || 'commonservice', // 见以上express配置中initSession方法介绍
    sessionKey: 'sessionId', // 见以上express配置中initSession方法介绍
    sessionCollection: 'sessions', // 见以上express配置中initSession方法介绍
    csrf: { // 初始化Lusca中间件解决CSRF问题时要用到的配置
        csrf: false,
        csp: false,
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        xssProtection: true
    },
    logger: { // express-winston 路由错误日志中间件的配置
        transports: [
            new winston.transports.Console({
                colorize: true
            })
        ]
    },
    logo: 'modules/core/client/img/logo.png', // 项目logo路径
    favicon: 'modules/core/client/img/favicon.ico', // 项目icon路径
    livereload: true // 是否启动livereload服务
};
```
以上配置中，每个属性也都有其默认值。    
在production.js中，更新了日志管理的配置项：
```
module.exports = {
    env: 'production',
    logger: {
        transports: [
            new winston.transports.Console({
                colorize: true
            }),
            new DailyRotateFile({
                level: 'silly',
                filename: path.resolve('./logs/access-'),
                datePattern: 'yyyy-MM-dd.log',
                maxsize: 5242880 /* 5MB */
            })
        ]
    },
    livereload: false
};
```
在config/config.js文件中，validateEnvironmentVariable方法会根据NODE_ENV判断当前系统环境，并根据当前环境加载对应的环境配置文件。

```
let validateEnvironmentVariable = function () {
    let environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
    if (!environmentFiles.length) {
        if (process.env.NODE_ENV) {
            console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment! Using development instead'));
        } else {
            console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
        }
        process.env.NODE_ENV = 'development';
    }
    // Reset console color
    console.log(chalk.white(''));
};
```
以上代码中，系统会自动加载NODE_ENV对应的环境配置文件，如果没有设置NODE_ENV则其默认为“development”。    
在config/config.js文件中，在初始化全局配置环境时，会将default.js与当前系统环境对应的环境配置文件进行合并。所以如果当前环境为生产环境，则default.js文件的相关配置将于production.js文件的相关配置进行合并。

```
let environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};
let config = _.merge(defaultConfig, environmentConfig);
config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {});
```
### 3.config/assets
config的assets文件夹中存放着以下不同系统环境对应的文静态文件路径的配置文件：
- default.js
- development.js
- production.js
- test.js
- uat.js
这里也只主要针对default文件和production文件进行对比。defaulte.js文件的代码如下：

```
module.exports = {
    client: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.min.css',
                ...
            ],
            js: [
                'public/lib/angular/angular.min.js',
                ...
            ]
        },
        css: [
            'modules/core/client/css/bootstrap-theme.css',
            ...
        ],
        sass: [
            'modules/*/client/scss/*.scss'
        ],
        font: [
            'modules/*/client/fonts/*'
        ],
        js: [
            'modules/core/client/app/config.js',
            ...
        ],
        img: [
            'modules/**/*/img/**/*.jpg',
            ...
        ],
        views: ['modules/*/client/views/**/*.html'],
        templates: ['build/templates.js']
    },
    server: {
        gulpConfig: ['gulpfile.js'],
        allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
        models: 'modules/*/server/models/**/*.js',
        routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
        APIRoutes: ['modules/core/server/apiRoutes/**/*.js', 'modules/!(core)/server/apiRoutes/**/*.js'],
        cronJobs: 'modules/*/server/cronJobs/**/*.js',
        config: 'modules/*/server/config/*.js',
        policies: 'modules/*/server/policies/*.js',
        views: 'modules/*/server/views/*.html'
    }
};
```
也上代码加载了所有开发中client端和server端的文件。其中client端包括所有前端用到的lib，css，sass，字体，图片以及html文件。server端包括gulp的配置文件，所有的配置文件，models，routes，cronJobs，policy和后端html模板文件。    
而production.js文件中只是替换了client端的lib，css以及js文件路径，因为生产环境中会把所有client端的lib，css，和js文件压缩到public文件夹中。

```
module.exports = {
    client: {
        lib: {
            css: 'public/stylesheets/lib*.min.css',
            js: 'public/javascripts/lib*.min.js'
        },
        css: 'public/stylesheets/app*.min.css',
        js: 'public/javascripts/app*.min.js'
    }
};

```
和环境变量一样，在config/config.js文件中，会把default.js文件中的静态文件路径配置和当前系统环境对应的静态文件路径配置文件进行合并，并最终将对应的文件路径加载到conig.files对象中供express初始化使用，代码如下：

```
var defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));
var environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};
var assets = _.merge(defaultAssets, environmentAssets);
...
```

### log配置
项目中使用[express-winston](https://github.com/bithavoc/express-winston)来进行日志管理。
我们在express中，使用如下代码来记录路由的错误信息：

```
app.use(expressWinston.errorLogger(config.logger));
```
在config/config.js文件中初始化log代码如下：

```
let initLoggerConfig = function (config) {
    /**
     * Create logger
     */
    let logger = new (winston.Logger)(config.logger);

    config.log = function () {
        logger.log(arguments);
    };

    config.info = function () {
        logger.info(arguments);
    };

    config.error = function () {
        logger.error(arguments);
    };

    config.debug = function () {
        logger.debug(arguments);
    };
};
```
以上代码封装了四种不同级别打印log的全局函数，即普通信息，提示性信息，错误信息以及警示信息。
其中的“config.logger”在default.js环境配置文件中为：

```
logger: {
        transports: [
            new winston.transports.Console({
                colorize: true
            })
        ]
    },
```
在production.js文件中为：

```
const DailyRotateFile = require('winston-daily-rotate-file');
logger: {
        transports: [
            new winston.transports.Console({
                colorize: true
            }),
            new DailyRotateFile({
                level: 'silly',
                filename: path.resolve('./logs/access-'),
                datePattern: 'yyyy-MM-dd.log',
                maxsize: 5242880 /* 5MB */
            })
        ]
    },
```
其中["winston-daily-rotate-file"](https://github.com/winstonjs/winston-daily-rotate-file)是一个通过winston，以天为单位创建log文件的日志管理中间件。
- **colorize**：是否使用调色板让Log文字带有颜色。
- **filename**：log文件存放的路径及文件名。
- **level**：输出日志的级别，从高到底为：{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }。
- **maxsize**：设置日志文件最大为5MB。
- **datePattern**：附加给文件名的日期格式，默认为“yyyy-MM-dd”。    

在gulp中，通过"makeUploadAndLogDir"创建“logs”文件夹：

```
gulp.task('makeUploadAndLogDir', () => {
    fs.mkdir('upload', (err) => {
        if (err && err.code !== 'EXIST') {
            console.error(err);
        }
    });
    fs.mkdir('logs', (err) => {
        if (err && err.code !== 'EXIST') {
            console.error(err);
        }
    });
});
```


---

## 后端代码规范 
### 前后端路由命名规范(不包括publicAPI)
##### 1. 路由命名
只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种	记录的"集合"（collection），所以API中的名词也应该使用复数

##### 2. 路由动词
post 	在服务器新建一个资源。  
get 	从服务器取出资源（一项或多项）。  
put     在服务器更新资源（客户端提供改变后的完整资源）。  
patch 	在服务器更新资源（客户端提供改变的属性）。  
delete	从服务器删除资源。  

比方说 请求一条user数据的路由应该是
```
{
    method: GET,
    url: 'users/:userID'
}
```
##### 3. 过滤信息
常用的过滤信息包括  
* ?limit=10：指定返回记录的数量
* ?offset=10：指定返回记录的开始位置。
* ?page=2&per_page=100：指定第几页，以及每页的记录数。
* ?sort=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。

项目中完全遵守RESTfulAPI，具体参照RESTfulAPI介绍
### 后端路由规范

路由写在每个module下server/routes中  
需要注意以下几点  
1. 路由通过`app.route`方法获取,在`post`, `get`, `delete`, `put`, `patch`方法中进行处理
2. 所有的路由必须进行acl权限验证，包括没有权限限制的路由
3. `app.params`方法针对ID进行是否属于符合mongoose的ObjectID的判断和是否存在该条数据的判断，不满足条件将分别返回400和404

以下是一段比较典型代码，其中定义了完整的增删改查

```
var path = require('path'),
    authHelper = require(path.resolve('./config/lib/auth')),
    moduleName = require('../controllers/moduleName.server.controller');

module.exports = function (app) {
    app.route('/app/moduleNames').all(authHelper.isAllowed)
        .get(moduleNames.list);
        .post(moduleNames.create);

    app.route('/app/moduleNames/:ID').all(authHelper.isAllowed)
        .delete(moduleNames.delete);
        .get(moduleNames.read);
        .put(moduleNames.update);

    app.param('ID', modules.moduleID);
};
```

### 后端model定义

model写在每个module下server/models中

需要注意以下几点:  
1. 需要针对每一个字段清楚的做出清楚的描述，即使只有type一个参数也需要用对象表示，以便更加直观和统一

2. type, level, status等字段由Number表示，并且用enum属性确定数值范围，防止数据库中插入错误的数据，并且添加注释表示数字和实际意义的对应关系。

3. Schema中可以增加参数timestamps可以用来代替之前的createTime和updateTime简化代码。

4. require中可以给出提示信息，并返回给前端

5. 可以利用插件实现一些功能，统一使用`mongoosePaginate`实现分页功能

6. 添加了get(Id)方法
```
let validateLocalStrategyEmail = function (email) {
    return (!this.updated || validator.isEmail(email, {
        require_tld: false
    }));
};

var ModuleSchema = new Schema({
    ModuleName: {
        type: String,
        required: 'please fill your name'
    },
    comments: {
        type: String,
        required: 'please fill your comments'
    },
    level: {
        type: Number,
        enum: [1, 2, 3, 4], // 1 feedback 2, log 3, warning 4, error
        required: true,
        default: 1
    }，
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
        required: 'Please fill in your email'
    },
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

ModuleSchema.plugin(mongoosePaginate);

ModuleSchema.statics = {
    get(id) {
        return this.findById(id)
            .exec()
            .then((module) => {
                if (module) {
                    return module;
                }
                const err = new APIError({code: '102003', messageInfo: ['module']}, 404);
                return Promise.reject(err);
            });
    }
};

mongoose.model('module', ModuleSchema, 'modules');
```

### 后端路由处理

路由处理写在每个module下server/controllers中



需要注意以下几点：

1. 对简单的增删改查尽量采用统一的命名方式
    * list: 获取全局数据
    * create: 添加数据
    * delete: 删除数据
    * read: 获取一条数据
    * update: 更新一条数据
2. read方法可以直接从req中获取数据，在app.param中已经针对id查询并且把数据绑定在req上。
3. 后端代码执行的时候发生错误可以通过`next(err)`传递给下一层中间件进行统一处理。

4. 自定义的错误可以通过new APIError定义
```
APIError = require(path.resolve('./config/lib/APIError'));
new APIError('CMSV_INVALID_ID_ERR', 400);
new APIError({code: 'CMSV_NOT_FOUND_ERR', messageInfo: ['Language anchor']}, 404)
```

具体写法如下所示：
```
exports.update = function (req, res, next) {
    let feedback = req.feedback;

    feedback = _.extend(feedback, req.body);

    feedback.save(err=> {
        if (err) {
          return next(err);
        } else {
            return res.send({
                code: 'CMSV_UPDATE_DATA_OK',
                messageInfo: ['Feedback', feedback.name]
            });
        }
    });
};
```

### 后端权限处理

权限处理定义在每个module下的server/policies下  

1. 每一条权限设置有roles和allows组成;
2. 对没有权限限制的路由，可以设置roles为guest(匿名);

具体写法如下：
```
{
    roles: ['admin', 'superuser'],
    allows: [
        {
            resources: '/app/messages',
            permissions: '*'
        },
        {
            resources: '/app/messages/import',
            permissions: ['post']
        },
        {
            resources: '/app/messages/:messageId',
            permissions: '*'
        }
    ]
},
```


---

## 前端代码规范 
### 简介
前端代码配置信息主要写在项目根目录下的config文件夹中，功能实现根据功能划分为各个模块写在modules下,主要包括：

- config 基本路由信息
- controller 页面逻辑
- scss/css 页面样式
- services 页面的各种数据数据处理以及调用api
- views 页面结构
- *.client.module.js 定义基本页面层级及模块引用   
 
### 基本文件模块(前端只有 client部分）

### config
1. url 全部是小写字母定义路由
2. controller: 模块名+Controller,模块名和controller首字母全部大写
3. controllerAs:'vm' 定义全部加controllerAs,改$scope为vm
4. templateUrl: 使用绝对路径即地址前带/ 后面统一带.html
5. data:pageTitle 按照路由的层级关系定义，比如：dashboard,dashboard-apps
```
demo:

$stateProvider
    .state('master.data', {
        url: '/data',
        templateUrl: 'modules/data/client/views/data.client.view.html',
        controller: 'DataController',
        data: {
            pageTitle: 'data'
        }
    })
```

### controller

1. 页面开始 var vm = this; 统一使vm代替之前的$scope
2. vm定义在前,内部属性方法靠后
3. controller内部使用的属性/方法全部使var定义，页面需要使用的使vm定义
4. controller不能对页面直接进行操作，初始化refresh放在页面init中进行
5. 命名规则：模块名+Controller，比如:DataController

```
demo:

var vm = this;

vm.refresh = refresh; // 页面中使用 ng-init = "vm.refresh()"

function refresh() {}
```

### scss/css

1. 项目使用scss或者直接使用css
2. 如果bootstrap有相关的类名，不自己定义css样式
3. 每个模块最外层要有自己模块名字作为类名，然后所有针对该模块的样式都被包裹在该类名之下
4. 类名命名规则：第一级是单个单词，之后每一级使用 - 连接，比如 apps,apps-brand
5. 类名嵌套：嵌套层数尽量不要过多，小于等于三层
6. id命名规则：同类名，但是使用_连接
7. 所有命名都要语义化

```
demo:

.data {
    .data-title {
    
    }
}
```

### services

1. 有两种：处理请求接口；处理逻辑问题
2. 前端请求：使用$resource请求
3. 私有属性方法：内部使用的命名使用 _
4. 更改this：去掉之前使用this的做法，全部使用reutrn返回
5. 命名规则：模块名+Service，比如:DataService

```
demo:

1.  appsService.$inject = ['$resource'];
    function appsService($resource) {
        return $resource('/app/auth/apps/:appId/:release', {
            appId: '@_id',
            release: '@release'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }
    
2. function appsViewsService(appsService) {
       
       return {
            getTitle:_getTitle
        }
       
        function _getTitle(_id, cb) {
            
        }
    }

```

### views

1. 使用语义化标签进行布局，不能全篇div
2. 可以配置的直使用ng-bind绑定，不能使用{{}}
3. 书写方式：出现英文的地方，全部小写，然后使用css控制它的大小写状态，比如全篇字母大写，首字母大写...

```
demo:

<h3 class="text-uppercase">title</h3>
<h3 class="text-capitalize">title</h3>
```

### *.client.module.js

1. 如果从其他页面参考时，要针对本模块，定义好需要注入的基本模块

```
demo:

(function (app) {
    'use strict';

    app.registerModule('apps');
    app.registerModule('apps.services');
    app.registerModule('apps.routes', ['ui.router']);

}(ApplicationConfiguration));

```


---

## CSS编写 （sass）UI/UX 
### 配置相关
1. 相对于1.0版本，2.0中使用 gulp将scss编译为css文件后，直接将css文件放在相应的scss文件之下，比如: 
     
    ```
    changePassword.scss编译过后的changePassword.css文件直接放在changePassword.scss之下。
    ```

2. CSS和SCSS文件的引入都在config/assets/default.js中：

    ```
    css: [
            'modules/core/client/css/bootstrap-theme.css',
            'modules/core/client/css/main.css',
            'modules/*/client/{css,less,scss}/*.css'
        ],
    sass: [
            'modules/*/client/scss/*.scss'
        ],
    ```
### 写法相关
1. 2.0版本使用Scss作为CSS预编译语言，去掉了所有Less文件;
2. 类名的命名单词之间依旧使用短横线'-'作为连接符;
3. 每个模块最外层的container需要一个类名作为最外层的类名，划分区域

### 规则相关
1. 网站需要运行CSSLint来避免一些错误，我们的Csslint中定义了哪些规则不需要验证
   
    ```
    {
      "adjoining-classes": false,
      "box-model": false,
      "box-sizing": false,
      "floats": false,
      "font-sizes": false,
      "important": false,
      "known-properties": false,
      "overqualified-elements": false,
      "qualified-headings": false,
      "regex-selectors": false,
      "unique-headings": false,
      "universal-selector": false,
      "unqualified-attributes": false
    }
    ```
2. SCSS层级嵌套不应该太深 不必和DOM的层级一定一致，一般不超过三层，层次过多会影响性能;
3. 尽量少用元素选择器，多使用类名来明确标识元素。

### UI/UX风格相关
1. CommonService2.0版本风格和1.0版本保持一致，因为CommonService属于管理系统网站，比较清晰简洁，后期有可能会更改网站的UI设计。

2. 网站首页即登录页面，登陆之后为网站主体部分，是很常用的左右结构，左边是不同模块，右边是模块内容，最上部分是网站最基本元素，网站Logo以及 网站名字以及登录用户相关操作，比如“登出”，“修改密码”等




# 企业管理后台

## 一、项目结构
~~~
.
├── App.css
├── App.js
├── App.test.js
├── assets
│   ├── font
│   └── img
├── components                                  
│   ├── CarImport
│   ├── ConfirmButton
│   ├── ConfirmExport
│   ├── ContentMain                     // 总体导航的配置
│   ├── CustomBreadcrumb
│   ├── CustomMenu
│   ├── DetailButton
│   ├── HeaderBar
│   ├── Import
│   ├── Loading
│   ├── PrivateRoute
│   ├── PromptBox
│   ├── SiderNav                        // 左边导航的配置
│   ├── TypingCard
│   └── Upload
├── index.css
├── index.js
├── logo.svg
├── registerServiceWorker.js
├── routes                              // 这里面是全部页面
│   ├── About                           // 关于
│   ├── Canteen                         // 食堂管理
│   ├── Car                             // 车辆管理
│   ├── Communicate                     // 协调沟通
│   ├── Index                           
│   ├── Login                           // 登陆
│   ├── Meeting                         // 会议
│   ├── Office                          // 办公室
│   ├── Other
│   ├── Project                         // 项目管理
│   ├── Statistics                      // 统计分析
│   ├── Structure                       // 组织结构管理
│   ├── Supermarket                     // 超市
│   ├── UseCar                          // 用车管理
│   └── upload-img.css
├── store
│   ├── appStore.js
│   └── index.js
├── test
│   └── index.jsx
└── utils
    ├── API.jsx                         // 网络请求
    ├── AsyncComponent.js
    ├── BGParticle.js
    ├── LoadableComponent.js
    ├── gVerify.js
    ├── typing.js
    ├── url.jsx
    └── utils.js
~~~
## 二、网络请求
这部分跟企业管理的差不多，除了下载文件不同。
~~~js
static get(url) {
    return axios({
        method: 'get',
        url,
    })
}
static post(url, params, type) {

    return axios({
        method: 'post',
        url,
        data: type === 'json' ? JSON.stringify(params) : qs.stringify(params),
        headers: {
        'Content-Type': type === 'json' ?
            'application/json;charset=utf-8' :
            'application/x-www-form-urlencoded;charset=utf-8'
        }
    })
}

static login(url, params) {
    return axios({
        method: 'post',
        url,
        data: qs.stringify(params),
    })
}

static upload(url, formData) {
    return axios({
        method: 'post',
        url,
        data: formData,
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
}

static downloadFile(url, params = {}) {
    let token = localStorage.getItem("token");
    url += "?token=" + token;
    Object.entries(params).forEach(v => {
        url += ("&" + v[0] + "=" + v[1]);
    })
    let a = document.createElement("a");
    a.href = url + "&avoidCache=" + Math.random();
    a.download = true;
    a.click();
}
~~~
特别需要说明的是文件下载，最后一个是文件下载，使用的方法很简单，直接传入需要传入的参数。
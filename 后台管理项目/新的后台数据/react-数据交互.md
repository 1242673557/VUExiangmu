### 1.axios

#### 1.安装

```
cnpm i  axios qs --save
```

#### 2.使用

配置代理,配置完成一定要重启项目

```
//package.json 
{
	"proxy":"http://localhost:3000",
}
```



```js
import axios from 'axios'
import qs from "qs"


axios.interceptors.requst.use(config=>{
    //请求拦截
    return config
})

axios.interceptors.response.use(res=>{
    //响应拦截
    return res;
})

axios({
    url:"/url",
    method:"get",
    params:{
        
    }
})

axios({
    url:"/url",
    method:"post",
    data:qs.stringify(data)
})
```



### 2.ant-design 

蚂蚁金服

官网：https://ant.design/index-cn  PC端

#### 安装

```
cnpm i antd --save
```

#### 引入

```js
//src/index.js
import 'antd/dist/antd.css'; 
```

ant-design mobile

### 3.flux


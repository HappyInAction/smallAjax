/*
* 常用ajax工具函数的封装
* */

/*模拟jquery的写法*/
var $ = {};
/*ajax方法*/
$.ajax = function(options){
    /*
    * 请求
    * 1. 请求方式    type    get  post   默认的是get   决定是否设置请求头
    * 2. 接口地址    url     不确定 字符串  如果用户没有传  默认的接口地址为当前路径
    * 3. 是否是异步  async    默认就是异步的 true; false 是同步请求
    * 4. 提交数据    data     使用的是对象{name:'xzz',age:18} 默认是｛｝
    *
    * 响应
    * 1. 成功回调函数  success   代表的是一个函数  用来处理成功之后的业务逻辑的函数
    * 1.1  字符串  xml  json格式的字符串  数据转换
    * 2. 失败回调函数  error     代表的是一个函数  用来处理失败之后的业务逻辑的函数
    * 2.1  返回一些错误信息
    * */



    /*处理默认参数*/
    if(!options || typeof options != 'object') return false;
    /*如果没有传使用默认的get方式提交*/
    var type = options.type || 'get';
    /*如果没有传使用默认的当前的路径**/
    var url = options.url || location.pathname;
    /*强制 是false的时候就是同步  否则都市异步*/
    var async = options.async === false?false:true;
    /*如果没有就是空对象*/
    var data = options.data || {};

    /*对象是无法进行传输{name:'',age:''}  拼接字符串  name=xzz&age=18*/
    var dataStr = '';

    for(key in data){
        dataStr += key+'='+data[key]+'&';
    }
    /*如果dataStr 就不去裁剪了*/
    dataStr = dataStr && dataStr.slice(0,-1);


    /*ajax封装编程*/
    /*初始化*/
    var xhr = new XMLHttpRequest();
    /*请求行*/
    /* 请求方式  请求地址  请求是否异步 */
    xhr.open(type,type == 'get'?url+'?'+dataStr:url,async);
    /*请求头*/
    if(type == 'post'){
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    }
    /*请求主体*/
    xhr.send(type=='get'?null:dataStr);

    /*响应*/
    xhr.onreadystatechange = function(){
        /*一定要完全完成通讯*/
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                /*请求成功*/
                /*字符串  xml  json格式的字符串  数据转换*/
                /*获取响应类型*/
                var contentType = xhr.getResponseHeader('Content-Type');

                var result = null;

                if(contentType.indexOf('xml') > -1){
                    /*xml*/
                    result = xhr.responseXML;
                }else if(contentType.indexOf('json') > -1){
                    /*json*/
                    result = JSON.parse(xhr.responseText);
                }else{
                    /*string*/
                    result = xhr.responseText;
                }

                options.success && options.success(result);

            }else{
                /*请求失败*/
                options.error && options.error({status:xhr.status,statusText:xhr.statusText});
            }
        }
    }

};

/*get*/
$.get = function(options){
    options.type = 'get';
    $.ajax(options);
}
/*post*/
$.post = function(options){
    options.type = 'post';
    $.ajax(options);
}
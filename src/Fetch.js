/**
 * Created by wangxi on 17/6/1.
 */
import fetch from  'isomorphic-fetch';
class Fetch {
    static  baseUrl = "http://118.31.220.241:8092";
    // static  baseUrl = "http://172.16.1.6:8092";

    static  download(url,name){
        if(url && name){
            var a = document.createElement('a');
            var url = url;
            var filename = name;
            a.href = url;
            a.download = filename;
            a.click();
        }
    }

    static get(url,callback){
        fetch(this.baseUrl + url,
            {
                method: "GET",
                mode:"cors",
                headers: {
                    "Content-Type": "text/plain;charset=UTF-8",
                    'Cache-Control': 'no-cache'
                }
            })
            .then(function(res){
                if (res.status === 200){
                    var ss = res.text();
                    return ss;
                }else {
                    callback(res);
                    console.log(res)
                }
            })
            .then(function (data) {
                callback(data);
            })
            .catch(function (e) {
                console.log("Error",e)
            })
    }

    static test(url,callback){
        fetch(url,
            {
                method: "GET",
                mode:"cors",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
            .then(function(res){
                if (res.status === 200){
                    callback(res);
                }else {
                    console.log(res)
                    callback(res);
                }
            })
            .catch(function (e) {
                console.log("Error",e)
            })
    }



    static fetchPost(url,jsonBody,callback){

       //XMLHttpRequest请求
        //
        // const req = new XMLHttpRequest();
        // req.onload = function () {
        //     if(this.status === 200||this.status === 304){
        //         console.log("responese",req.response);
        //         callback(JSON.parse(req.response));
        //     }
        // }
        //
        //
        // req.open('POST', Fetch.baseUrl + url)
        // req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        //
        // req.send(JSON.stringify(jsonBody))

        //fetch请求
        fetch(this.baseUrl + url,
            {
                method: "POST",
                body: JSON.stringify(jsonBody),
                mode:"cors",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
            .then(function(res){
                if (res.status === 200){
                    // console.log("res",res.json());
                    return res.json();
                }else {
                    console.log(res.json())
                }


            })
            .then(function(data){
               return callback(data);
            })
            .catch(function (e) {
                console.log("Error",e)
            })
    }



}
export  default Fetch;
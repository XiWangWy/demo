/**
 * Created by wangxi on 17/6/1.
 */
import fetch from  'isomorphic-fetch';
import history from './history';
class Fetch {
    static  baseUrl = "http://172.16.1.34:8080";
    static storage = window.localStorage;

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

    static  downloadWithPath(path,name){
        if(path && name){
            var a = document.createElement('a');
            var filename = name;
            a.href = this.baseUrl + path;
            a.download = filename;
            a.click();
        }
    }


    static get(url, callback) {
        try {
            console.log(JSON.parse(this.storage.getItem('data'))['token'])
        } catch(err) {
            history.replace('/login')
            return;
        }

        fetch(encodeURI(this.baseUrl + url), {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                'Cache-Control': 'no-cache',
                'token': JSON.parse(this.storage.getItem('data'))['token']
            }
        }).then(function(res) {
            if (res.status === 200) {
                var ss = res.text();
                return ss;
            } else {
                callback(res);
                console.log(res)
            }
        }).then(function(data) {
            callback(data);
        }).
        catch(function(e) {
            console.log("Error", e)
        })
    }

    static test(url, callback) {
        fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            xhrFields: {
                withCredentials: true
            }
        }).then(function(res) {
            if (res.status === 200) {
                callback(res);
            } else {
                console.log(res)
                callback(res);
            }
        }).
        catch(function(e) {
            console.log("Error", e)
        })
    }

    static testPost(url,jsonBody,callback){
        fetch(url,
            {
                method: "POST",
                body: JSON.stringify(jsonBody),
                mode:"cors",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                xhrFields: {
                    withCredentials: true
                },
                credentials: 'include'
            })
            .then(function(res){
                if (res.status === 200){
                    var ss = res.text();
                    return ss;
                }else {
                    console.log(res.json())
                }
            })
            .then(function(data){
                callback(data);
            })
            .catch(function (e) {
                console.log("Error",e)
            })
    }

    static fetchPost(url,jsonBody,callback){
        //fetch请求
        fetch(this.baseUrl + url,
            {
                method: "POST",
                body: JSON.stringify(jsonBody),
                mode:"cors",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    'Cache-Control': 'no-cache',
                    'token':  this.storage.getItem('data') == null ? "" : JSON.parse(this.storage.getItem('data'))['token']
                }
            })
            .then(function(res){
                if (res.status === 200){
                    var ss = res.text();
                    return ss;
                }else {
                    return res.text();
                }


            })
            .then(function(data){
                callback(data);
            })
            .catch(function (e) {
                console.log("Error",e)
            })
    }



}
export  default Fetch;
/**
 * Created by wangxi on 17/6/1.
 */
import fetch from  'isomorphic-fetch';
class Fetch {
    static  baseUrl = "http://127.0.0.1:8888";
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
        fetch(Fetch.baseUrl + url,
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
                }


            })
            .then(function(data){
               return callback(data);
            })
    }

}
export  default Fetch;
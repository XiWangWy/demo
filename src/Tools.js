/**
 * Created by wangxi on 18/7/20.
 */
class Tools {
       /**
     * 判断对象是否为空
     * @param obj
     * @returns {boolean}
     */
       static  isEmptyObject(obj){
        if (JSON.stringify(obj) === '{}' || obj === undefined) {
            return true;
        } else {
            return false;
        }
    }

    //用于生成uuid
    static S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    static guid(){
        return (this.S4()+this.S4()+this.S4()+this.S4()+this.S4()+this.S4()+this.S4()+this.S4());
    }


    static undefineToNull(obj){
        if (obj === 'undefine'){
            return null;
        }
    }

// ArrayBuffer转为字符串，参数为ArrayBuffer对象
   static ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
    }

    // static isLong(obj){
    //     return typeof obj == 'long' || typeof obj == 'int';
    //     // return !(typeof  obj === 'String');
    // }

    static deleteObjInArray(obj,arry){
        var index = arry.indexOf(obj);
        if (index > -1){
            arry.splice(index,1);
        }
    }

    static unique(array, array1) {
    //将array数组转换成set对象
    var setObj = new Set(array)
    //循环数组array1，并将值通过add插入set对象中,此时重复数据并不会插入其中
    for(var i = 0; i < array1.length; i++) {
        setObj.add(array1[i]);
    }
    //使用Array.from()方法将set对象转换成数组，并使用sort()方法排序
    return Array.from(setObj);
    }

    static  removeErrorStr(arry){
        if (arry.length === 1 && arry.indexOf("全部") !== -1){
            return [];
        }else {
            return arry;
        }
    }

}




export default Tools;
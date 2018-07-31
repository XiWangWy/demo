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

}



export default Tools;
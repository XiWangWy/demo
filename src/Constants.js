/**
 * Created by wangxi on 18/7/30.
 */
import config from './config/config.json'
import natures from './config/natures.json'

class Constants {
    static getAllType(){
        return config;
    }

    static  getTypeData(key){
        return config[key];
    }

    static getAllNatures(){
        return natures["词性"];
    }

    static getAllEntityType(){
        var arry = [];
        for(var key in config){
            arry.push(key)
        }
        return arry;
    }

    static getName(key){
        if (key === "空" || key === ""){
            return [];
        }
        return config[key]["实体字段名"];
    }
}

export default Constants;

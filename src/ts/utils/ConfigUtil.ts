import HttpClient from "@/ts/net/HttpClient";
import NewsConfigModel, {GetRegincodeModel, NewModel, NewsModel} from "@/ts/models/NewsModel";
export default class ConfigUtil {
    /**
     * 配置文件路径
     */
    public static CONFIG_JSON = "config.json" + "?t=" + new Date().valueOf();
    public static RECHARGE_JSON = "config/package.json" + "?t=" + new Date().valueOf();
    public static GAME_JSON = "config/game.json" + "?t=" + new Date().valueOf();

    public static ACTIVITY_JSON = "activityconfig.json" + "?t=" + new Date().valueOf();
    private configJson = null;
    private rechargeJson = null;
    private gamesJson = null;

    private activityConfigJson = null;
    private region_code: number = 0;

    /**
     * 省市区配置
     */
    public static PROVINCE_CONFIG =
        "province_config.json" + "?t=" + new Date().valueOf();
    private configProvince = null;
    /**
     * 国服资讯列表
     */
    public static NEWS_GUOFU_LIST = "news_area";
    private newsGuofuList = null;
    /**
     * 游戏资讯分类
     */
    public static NEWS_CLASSIFY_LIST = "news_public";
    private newsClassifyList = null;
    /**
     * 资讯标签列表
     */
    public static NEWS_LABELS_LIST = "news_game";
    private newsLabelsList = null;
    /**
     * 公告列表
     */
    public static NOTIFY_LIST = "notice_list";
    private notifyList = null;
    /**
     * 帮助列表
     */
    public static HELPS_LIST = "helps_list";
    private helpsList = null;
    /**
     * 相关问答
     */
    public static QUESTIONS_LIST = "questions_list";
    private questionssList = null;

    /**
     * 获取region_code
     */
    public static REGIONCODE = "/geoip2/index.php";
    private regioncode = null;
    /**
     * 获取国家地区代码
     */
    public static COUNTRYCODELIST = "/geoip2/country_codes.json";
    private configCountryCode = null;

    /**
     * 获取路由器列表
     */
    public static ROUTER_LIST = "routerlists.json";
    private routerlist = null;

    //
    private static instance: ConfigUtil = null;
    private httpC = new HttpClient();

    /**
     * 单例
     */
    public static getInstance() {
        if (ConfigUtil.instance == null) {
            ConfigUtil.instance = new ConfigUtil();
        }
        return ConfigUtil.instance;
    }

    /**
     * 下载配置文件
     * @param isrootUrl是否从项目的根目录读取配置
     */
    public async download(isrootUrl: boolean = false) {
        if (this.configJson == null) {
            let url = '';
            if(isrootUrl) {
                // 兼容IE的处理
                if (!window.location.origin) {
                    //@ts-ignore
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                }
                url = window.location.origin + "/" + ConfigUtil.CONFIG_JSON;
            }else {
                url = './' + ConfigUtil.CONFIG_JSON;
            }
            let param = {};
            //
            try {
                this.configJson = await this.httpC.get(url, param);
                return this.configJson;
            } catch (e) {
                return null;
            }
        } else {
            return this.configJson;
        }
    }
    /**
     * 下载配置文件
     * @param isrootUrl是否从项目的根目录读取配置
     */
    public async getRechargeJson(urlHead:string) {
        if (this.rechargeJson == null) {
            let url = urlHead+"/" + ConfigUtil.RECHARGE_JSON;
            let param = {};
            //
            try {
                this.rechargeJson = await this.httpC.get(url, param);
                return this.rechargeJson;
            } catch (e) {
                return null;
            }
        } else {
            return this.rechargeJson;
        }
    }

    /**
     * 下载配置文件
     * @param isrootUrl是否从项目的根目录读取配置
     */
    public async getGamesJson(urlHead:string) {
        if (this.gamesJson == null) {
            let url = urlHead+"/" + ConfigUtil.GAME_JSON;
            let param = {};
            //
            try {
                this.gamesJson = await this.httpC.get(url, param);
                return this.gamesJson;
            } catch (e) {
                return null;
            }
        } else {
            return this.gamesJson;
        }
    }
    /**
     * 下载省、市、区配置文件
     */
    public async getProvince() {
        if (this.configProvince == null) {
            let url = window.location.origin + "/" + ConfigUtil.PROVINCE_CONFIG;
            let param = {};
            //
            try {
                this.configProvince = await this.httpC.get(url, param);
                return this.configProvince;
            } catch (e) {
                return null;
            }
        } else {
            return this.configProvince;
        }
    }

    /**
     * 读官网下面 各国地区的json文件
     *
     */
    public async getCounteyCode(rootUrl:string) {
        if (this.configProvince == null) {
            let url =  rootUrl + ConfigUtil.COUNTRYCODELIST;
            let param = {};
            //
            try {
                this.configCountryCode = await this.httpC.get(url, param);
                return this.configCountryCode;
            } catch (e) {
                return null;
            }
        } else {
            return this.configCountryCode;
        }
    }

    /**
     * 获取资讯分类列表
     * @param baseUrl
     * @param region_code
     * @param label 标签
     */
    public async getNewsClassifyList(param: NewsConfigModel) {
        let url = this.getJsonName(param, ConfigUtil.NEWS_CLASSIFY_LIST);
        //
        if (this.newsClassifyList == null) {
            this.newsClassifyList = await this.httpC.get(url, param);
        }
        try {
            //model
            let model = new NewsModel();
            model.current_page = param.page;

            //list
            let list = this.newsClassifyList;
            if (list == null) list = [];
            if (param.label != "" && param.label != null) {
                list = this.newsClassifyList[param.label];
                model.total = list.length;
                list = ConfigUtil.getPageList(list, param);
            }
            model.list = list as Array<NewModel>;
            if (model.list != null) {
                let tempArr = [];
                for (const i in list) {
                    list[i].date_time = list[i].publish_time.split(" ")[0];
                    tempArr = list[i].date_time.split("-");
                    if (tempArr != null && tempArr.length > 2) {
                        list[i].publish_time_year = tempArr[0];
                        list[i].publish_time_month = tempArr[1];
                        list[i].publish_time_day = tempArr[2];
                    }
                }
            }

            return model;
        } catch (e) {
            return new NewsModel();
        }
    }

    /**
     * 获取资讯标签列表
     * @param baseUrl
     */
    public async getNewsLabelsList(param: NewsConfigModel) {
        let url = this.getJsonName(param, ConfigUtil.NEWS_LABELS_LIST);
        console.log(url);
        //
        if (this.newsLabelsList == null) {
            this.newsLabelsList = await this.httpC.get(url, param);
        }
        // try {
            //model
            let model = new NewsModel();
            model.current_page = param.page;

            //list
            let list = this.newsLabelsList;
            if (list == null) list = [];
            if (param.label != "" && param.label != null) {
                list = this.newsLabelsList[param.label];
                model.total = list.length;
                list = ConfigUtil.getPageList(list, param);
                model.list = list as Array<NewModel>;
            } else {
                // 解析label标签
                let keyList = [];
                let tmpObj = {};
                Object.keys(list).forEach(function (key, value) {
                    tmpObj = {};
                    tmpObj["label"] = key;
                    tmpObj["list"] = list[key];
                    keyList.push(tmpObj);
                });
                model.list = keyList;
            }

            return model;
        // } catch (e) {
        //     return new NewsModel();
        // }
    }

    /**
     * 获取公告列表
     */
    public async getNotifyList(param: NewsConfigModel) {
        let url = this.getJsonName(param, ConfigUtil.NOTIFY_LIST);
        //
        if (this.notifyList == null) {
            this.notifyList = await this.httpC.get(url, param);
        }
        try {
            //model
            let model = new NewsModel();
            model.current_page = param.page;
            //list
            let list = this.notifyList;
            if (list == null) list = [];
            model.total = list.length;
            list = ConfigUtil.getPageList(list, param);
            model.list = list as Array<NewModel>;
            //
            if (model.list != null) {
                let tempArr = [];
                for (const i in list) {
                    list[i].date_time = list[i].publish_time.split(" ")[0];
                    tempArr = list[i].date_time.split("-");
                    if (tempArr != null && tempArr.length > 2) {
                        list[i].publish_time_year = tempArr[0];
                        list[i].publish_time_month = tempArr[1];
                        list[i].publish_time_day = tempArr[2];
                    }
                }
            }
            return model;
        } catch (e) {
            return new NewsModel();
        }
    }

    /**
     * 获取帮助列表
     */
    public async getHelpsList(param: NewsConfigModel) {
        let url = this.getJsonName(param, ConfigUtil.HELPS_LIST);
        //
        if (this.helpsList == null) {
            this.helpsList = await this.httpC.get(url, param);
        }

        try {
            //model
            let model = new NewsModel();
            model.current_page = param.page;

            //list
            let list = this.helpsList;
            if (list == null) list = [];
            model.total = list.length;
            list = ConfigUtil.getPageList(list, param);
            model.list = list as Array<NewModel>;

            return model;
        } catch (e) {
            return new NewsModel();
        }
    }

    /**
     * 设置后缀名称
     */
    public getJsonName(param: NewsConfigModel, name: string): string {
        // const url = baseUrl + jsonUrl + '_' + region_code + '.json' + '?t=' + (new Date()).valueOf();
        const url =
            param.baseUrl +
            "/news/news" +
            "_" +
            param.region_code +
            "_" +
            param.support_type +
            "_" +
            name +
            ".json";
        return url;
    }

    /**
     * 获取分页数据
     * @param list
     * @param page
     * @param size
     */
    public static getPageList(list, param: NewsConfigModel) {
        const s = (param.page - 1) * param.size;
        const e = (param.page - 1) * param.size + param.size;
        list = list.slice(s, e);

        return list;
    }

    /**
     * 获取regincode 信息
     */
    public async getRegincode(rootUrl?:string) {
        let url = rootUrl+ ConfigUtil.REGIONCODE;
        // let url = `http://dev-www.leigod.com${ConfigUtil.REGIONCODE}`;
        let param = {};
        let data = await this.httpC.get<GetRegincodeModel>(url, param);
        let region_infos = data.data;
        return region_infos;
    }


    public async getRouterList(){
        if (this.routerlist == null) {
            let url = window.location.origin + "/" + ConfigUtil.ROUTER_LIST;
            let param = {};
            //
            try {
                this.routerlist = await this.httpC.get(url, param);
                return this.routerlist;
            } catch (e) {
                return null;
            }
        } else {
            return this.routerlist;
        }
    }

}

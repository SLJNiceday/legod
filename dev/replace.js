var operate=require('leigod_copy');
var configParam = process.env.npm_lifecycle_event;
var configParamArr = configParam.split('-');
if (configParamArr[0].indexOf("bohe") > -1) {
    operate.copyDir(0, configParamArr[0], '../src/assets/i18n/bohe_language_config.json', '../bohe_meta.json', '../src/assets/i18n/bohe_i18n_config.json');
} else {
    operate.copyDir(1, configParamArr[0], '../src/assets/i18n/ls_language_config.json', '../leishen_meta.json', '../src/assets/i18n/ls_i18n_config.json');
}
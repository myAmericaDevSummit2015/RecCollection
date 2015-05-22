module.exports.apply = function(dirname) {
    var localAppInfo = {};
    var localServices = {};

    global.__base = dirname + '/';
    global.__appInfo = JSON
        .parse(process.env.VCAP_APPLICATION || JSON.stringify(localAppInfo));
    global.__services = JSON
        .parse(process.env.VCAP_SERVICES || JSON.stringify(localServices));
};

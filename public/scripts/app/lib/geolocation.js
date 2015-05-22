var Application = (function(module) {
    var Geolocation = {};

    Geolocation.position = null;

    Geolocation.geolocate = function(callback) {
        if('geolocation' in navigator) {
            navigator
                .geolocation
                .getCurrentPosition(function(position) {
                    Geolocation.position = position;
                    callback(Geolocation.position);
                });
        } else {
            // TODO: Custom error
            throw Error('Geolocation not implemented in ' + navigator);
        }
    };

    module.Geolocation = Geolocation;

    return module;
})(Application || {});

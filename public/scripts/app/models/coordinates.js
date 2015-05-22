var Application = (function(module) {
    if(!module.models) { module.models = {} }

    // TODO: Make argument options
    module.models.Coordinates = function(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    };

    return module;
})(Application || {});

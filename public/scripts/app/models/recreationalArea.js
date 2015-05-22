var Application = (function(module) {
    if(!module.models) { module.models = {} }

    module.models.RecreationalArea = function(options) {
        this.name = options.name,
        this.description = options.description,
        this.phone = options.phone,
        this.email = options.email,
        this.latitude = options.latitude,
        this.longitude = options.longitude,
        this.directions = options.directions,
        this.fee_description = options.fee_description,
        this.reservation_url = options.reservation_url,
        this.map_url = options.map_url
    }

    return module;
})(Application || {});

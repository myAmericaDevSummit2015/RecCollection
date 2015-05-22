var Application = (function(module) {
    if(!module.models) { module.models = {} }

    module.models.Facility = function(options) {
        this.ada_access = options.ada_access,
        this.description = options.description,
        this.directions = options.directions,
        this.email = options.email,
        this.id = options.id,
        this.latitude = options.latitude,
        this.longitude = options.longitude,
        this.map_url = options.map_url,
        this.name = options.name,
        this.phone = options.phone,
        this.reservation_url = options.reservation_url,
        this.type_description = options.type_description,
        this.use_fee_desciption = options.use_fee_description
    }

    return module;
})(Application || {});

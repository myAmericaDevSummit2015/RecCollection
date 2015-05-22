var Application = (function(module) {
    if(!module.models) { module.models = {} }

    module.models.Weather = function(options) {
        this.locale = options.locale;
        this.country = options.country;
        this.latitude = options.latitude;
        this.longitude = options.longitude;
        this.sunrise = options.sunrise;
        this.sunset = options.sunset;
        this.general = options.general;
        this.description = options.description;
        this.minTemp = options.minTemp,
        this.maxTemp = options.maxTemp,
        this.temperature = options.temperature;
        this.humidity = options.humidity;
        this.pressure = options.pressure;
        this.windSpeed = options.windSpeed;
        this.windGust = options.windGust;
        this.windDegrees = options.windDegrees;
        this.rain = options.rain;
        this.snow = options.snow;
        this.clouds = options.clouds;
    };

    return module;
})(Application || {});

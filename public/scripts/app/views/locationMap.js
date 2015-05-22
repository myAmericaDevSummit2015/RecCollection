var Application = (function(module) {
    if(!module.views) { module.views = {} }

    var initLocationData = function(currentLocation, module) {
        var name = module.querySelector('#location-name');
        name.textContent = currentLocation.name

        var phone = module.querySelector('#location-phone');
        phone.textContent = currentLocation.phone;

        var email = module.querySelector('#location-email');
        email.textContent = currentLocation.email;
    };

    var initWeatherData = function(current, forecasts, module) {
        var currentSummary = module.querySelector('#current-summary');
        currentSummary.textContent = [
            current.general,
            ' (',
            current.description,
            ')'].join('');

        var currentLocation = module
            .querySelector('#current-locale');
        currentLocation.textContent = [
            current.locale,
            ', ',
            current.country].join('');

        var currentTemperature = module.querySelector('#current-temperature');
        currentTemperature.textContent = current.temperature;

        var forecastsContainer = module.querySelector('#forecasts');

        // NOTE: Forecasts are limited to 3 here.
        forecasts.slice(0, 3).forEach(function(forecast) {
            var div = document.createElement('div');
            var temperature = forecast.temperature,
                maxTemp = forecast.maxTemp,
                minTemp = forecast.minTemp;

            var content = [
                forecast.description,
                '|',
                'High:',
                forecast.maxTemp,
                'Low:',
                forecast.minTemp
            ].join(' ');

            var textNode = document.createTextNode(content);

            div.appendChild(textNode);
            forecastsContainer.appendChild(div);
        });
    };

    var endLoading = function() {
        var container = document.body.querySelector('#weather-wrapper');
        container.removeChild(container.firstChild);
    };

    module.views.LocationMapView = function() {
        // TODO: Move map to Application.map.map (exiquio)
        this.render = function(map, currentLocation, current, forecast) {
            var marker = L
                .marker([currentLocation.latitude, currentLocation.longitude]);

            var template = document
                .body
                .querySelector('#location-template');

            marker.on('click', function(event) {
                var newLocationModule = document
                    .importNode(template.content, true);

                initLocationData(currentLocation, newLocationModule);
                initWeatherData(current, forecast, newLocationModule);

                this.bindPopup(newLocationModule);
            });

            Application.map.markers.addLayer(marker);
        };
    };

    return module;
})(Application || {});

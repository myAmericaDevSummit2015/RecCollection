var Application = (function(module) {
    if(!module.views) { module.views = {} }

    var initLocationData = function(locale, module) {
        var name = module.querySelector('#location-name');
        name.textContent = locale.name

        var phone = module.querySelector('#location-phone');
        phone.textContent = locale.phone;

        var email = module.querySelector('#location-email');
        email.textContent = locale.email;
    };

    var initWeatherData = function(weather, module) {
        var current = weather.current,
            forecast = weather.forecast;
        var currentSummary = module.querySelector('#current-summary');
        currentSummary.textContent = [
            current.general,
            ' (',
            current.description,
            ')'].join('');

        var locale = module
            .querySelector('#current-locale');
        locale.textContent = [
            current.locale,
            ', ',
            current.country].join('');

        var currentTemperature = module.querySelector('#current-temperature');
        currentTemperature.textContent = current.temperature;

        var forecastContainer = module.querySelector('#forecast');

        // NOTE: Forecasts are limited to 3 here.
        forecast.slice(0, 3).forEach(function(forecast) {
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
            forecastContainer.appendChild(div);
        });
    };

    var buildText = function(locale, weather) {
        var current = weather.current,
            forecast = weather.forecast;

        var text = [
            locale.name,
            'Weather information:',
            'Currently the weather in',
            current.locale,
            'is',
            current.general,
            'with a temperature of',
            current.temperature,
            'degrees Fahrenheit.'
        ].join(' ');

        return text;
    };

    var initTextToSpeech = function(locale, weather, module) {
        var link = module.querySelector('#text-to-speech-link');

        var textToSpeech = function() {
            Application.controllers.TextToSpeechController
                .speak(buildText(locale, weather));
        };

        link.addEventListener('click', textToSpeech);
    };

    // TODO: Use (exiquio)
    var endLoading = function() {
        var container = document.body.querySelector('#weather-wrapper');
        container.removeChild(container.firstChild);
    };

    module.views.LocationMapView = function() {
        // TODO: Move map to Application.map.map (exiquio)
        this.render = function(map, locale, current, forecast) {
            var marker = L
                .marker([locale.latitude, locale.longitude]);

            var template = document
                .body
                .querySelector('#location-template');

            var newLocationModule = document
                .importNode(template.content, true);
            
            var weather = {
                current: current,
                forecast: forecast
            };

            initLocationData(locale, newLocationModule);
            initWeatherData(weather, newLocationModule);
            initTextToSpeech(locale, weather, newLocationModule);

            marker.on('click', function(event) {
                this.bindPopup(newLocationModule);
            });

            Application.map.markers.addLayer(marker);
        };
    };

    return module;
})(Application || {});

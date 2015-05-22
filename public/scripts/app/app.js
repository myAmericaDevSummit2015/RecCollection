(function() {
    var processes,
        originalProcesses,
        map,
        currentPosition,
        currentLocation,
        currentWeather,
        currentForecasts;

    // TODO: Move coordinate function to coordinate helper (exiquio)
    var parseLatitude = function(position) {
        return position.coords.latitude;
    };

    var parseLongitude = function(position) {
        return position.coords.longitude;
    };

    var coordinatesFromPosition = function(position) {
        return new Application.models.Coordinates(
                parseLatitude(position),
                parseLongitude(position));
    };

    // TODO: Move to WeatherController (or model?) (exiquio)
    var applyForecastWeather = function(data) {
        var forecasts = [];

        var city = data.city;
        var coord = city ? city.coord : null;
        var locale = city ? city.name : null;
        var country = city ? city.country : null;
        var latitude = coord ? coord.lat : null;
        var longitude = coord ? coord.lon : null;
        var list = data.list;

        list.forEach(function(weather) {
            var temp = weather.temp;
            var additionalData = weather.weather[0];

            var options = {
                 locale: locale,
                 country: country,
                 latitude: latitude,
                 longitude: longitude,
                 sunrise: null, // REVIEW: Not implemented
                 sunset: null, // REVIEW: Not implemented
                 general: additionalData.main,
                 description: additionalData.description,
                 temperature: temp.day,
                 maxTemp: temp.max,
                 minTemp: temp.min,
                 humidity: weather.humidity,
                 pressure: weather.pressure,
                 windSpeed: weather.speed,
                 windGust: weather.gust,
                 windDegrees: weather.deg,
                 rain: weather.rain,
                 snow: weather.snow,
                 clouds: weather.clouds
            };

            forecasts.push(new Application.models.Weather(options));
        });

        currentForecasts = forecasts;
    };

    // TODO: Move to WeatherController (or model?) (exiquio)
    var applyCurrentWeather = function(data) {
        var sys = data.sys;
        var coord = data.coord;
        var weather = data.weather[0];
        var main = data.main;
        var wind = data.wind;
        var rain = data.rain;
        var snow = data.snow;
        var clouds = data.clouds;

        var options = {
            locale: data.name,
            country: sys ? sys.country : null,
            latitude: coord ? coord.lat : null,
            longitude: coord ? coord.lon : null,
            sunrise: sys ? sys.sunrise : null,
            sunset: sys ? sys.sunset : null,
            general: weather ? weather.main : null,
            description: weather ? weather.description : null,
            temperature: main ? main.temp : null,
            // NOTE: There seems to be a bug in OpenWeatherMaps with temp min
            // and max:
            //
            //   HTTP GET:
            //   http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139
            //
            //   yields:
            //
            // {"coord":...
            //  "main":{"temp":292.779,"temp_min":292.779,"temp_max":292.779
            //  ...}
            //
            // As can be seen, the values are all the same. Not correct!
            //
            // (exiquio)
            minTemp: main ? main.temp_min : null,
            maxTemp: main ? main.temp_max : null,
            humidity: main ? main.humidity : null,
            pressure: main ? main.pressure : null,
            windSpeed: wind ? wind.speed : null,
            windGust: wind ? wind.gust : null,
            windDegrees: wind ? wind.deg : null,
            rain: rain ? rain['3h'] : null,
            snow: snow ? snow['3h'] : null,
            clouds: clouds ? clouds.all : null};

        currentWeather = new Application.models.Weather(options);
    };

    // TODO: Move to WeatherController (or model?) (exiquio)
    var initWeather = function(type, callback) {
        var success = function(data) { callback(data); };

        // TODO: Do something "better" than this (exiquio)
        var error = function(responseStatus) { console.log(responseStatus); };

        Application.controllers.WeatherController.fetch(
            type,
            coordinatesFromPosition(currentPosition),
            success,
            error);
    };

    // TODO: Move to RIDBController (or model?) (exiquio)
    var renderLocationToMap = function() {
        new Application.views.LocationMapView()
            .render(map, currentLocation, currentWeather, currentForecasts);
    };

    // TODO: Move somewhere decent (exiquio);
    var updateCurrentCoordinates = function(latitude, longitude) {
        delete currentPosition.coords.latitude;
        delete currentPosition.coords.longitude;

        currentPosition.coords.latitude = latitude;
        currentPosition.coords.longitude = longitude;
    };

    var processWeather = function() {
        var currentWeatherIsFinished = false,
            forecastWeatherIsFinished = false;

        var currentWeatherFinished = function(data) {
            applyCurrentWeather(data);

            currentWeatherIsFinished = !currentWeatherIsFinished;
        };

        var forecastWeatherFinished = function(data) {
            applyForecastWeather(data);

            forecastWeatherIsFinished = !forecastWeatherIsFinished;
        };

        var weatherProcesses = [
            {
                method: 'initWeather',
                type: 'current',
                callback: currentWeatherFinished
            },
            {
                method: 'initWeather',
                type: 'forecast',
                callback: forecastWeatherFinished
            }
        ];

        var waitForWeatherThenRender = function() {
            var nextWeatherProcess = function() {
                if(!weatherProcesses.length == 0) {
                    var process = weatherProcesses.pop();
                }

                if(process) {
                    eval(process.method)(process.type, process.callback);
                }
            }

            if(currentWeatherIsFinished && forecastWeatherIsFinished) {
                renderLocationToMap();
                processLocations();
            } else {
                nextWeatherProcess();
                setTimeout(waitForWeatherThenRender, 400);
            }
        };

        waitForWeatherThenRender();
    };

    var locations = [];

    // TODO: Move to RIDBController (or model?) (exiquio)
    var processLocations = function() {
        var  thisLocation = locations.pop();

        if(thisLocation) {
            currentLocation = thisLocation;

            updateCurrentCoordinates(
                thisLocation.latitude,
                thisLocation.longitude
            );

            processWeather();
        } else {
            nextProcess();
        }
    };

    // TODO: Move to RIDBController (or model?) (exiquio)
    var applyFacilities = function(data) {
        data.RECDATA.forEach(function(facility) {
            var options = {
                ada_access: facility.FacilityAdaAccess,
                description: facility.FacilityDescription,
                directions: facility.FacilityDirections,
                email: facility.FacilityEmail,
                id: facility.FacilityID,
                latitude: facility.FacilityLatitude,
                longitude: facility.FacilityLongitude,
                map_url: facility.FacilityMapUrl,
                name: facility.FacilityName,
                phone: facility.FacilityPhone,
                reservation_url: facility.FacilityReservationUrl,
                type_description: facility.FacilityTypeDescription,
                use_fee_description: facility.UseFeeDescription
            }

            locations.push(new Application.models.Facility(options));
        });

        processLocations();
    };

    // TODO: Move to RIDB Conroller (or model?) (exiquio)
    var applyRecreationalAreas = function(data) {
        data.RECDATA.forEach(function(area) {
            var options = {
                name: area.RecAreaName,
                description: area.RecAreaDescription,
                phone: area.RecAreaPhone,
                email: area.RecAreaEmail,
                latitude: area.RecAreaLatitude,
                longitude: area.RecAreaLongitude,
                fee_description: area.RecAreaFeeDescription,
                reservation_url: area.RecAreaReservationURL,
                map_url: area.RecAreaMapURL
            };

            locations.push(new Application.models.RecreationalArea(options));
        });

        processLocations();
    };

    // TODO: Move to RIDBController (or model?) (exiquio)
    var applyRIDB = function(type, data) {
        switch(type) {
            case 'facilities':
                applyFacilities(data);

                break;
            case 'recreational_areas':
                applyRecreationalAreas(data);

                break;
            default:
                throw new Error(type + ' is not a valid type');
        }
    };

    // TODO: Move to RIDBController (or model?) (exiquio)
    var initRIDB = function(options) {
        // TODO: Find a good place for this (exiquio)
        Application.map.markers.clearLayers();

        var success = function(data) {
            options.callback(Application.ridb.type, data);
        };

        var error = function(responseStatus) { console.log(responseStatus); };

        Application.controllers.RIDBController.fetch(
            Application.ridb.type,
            coordinatesFromPosition(currentPosition),
            success,
            error
        );
    };

    var initSettings = function(options) {
        if(!originalProcesses) originalProcesses = processes.slice();

        if(!Application.ridb.limit) Application.ridb.limit = '10';
        if(!Application.ridb.radius) Application.ridb.radius = '50';

        var settingsPanel = document.getElementById('settings');

        settingsPanel.panelunload = function() {
            var form = document.getElementById('settings-form');
            var elements = form.elements;
            var type, limit, radius;

            if((type = elements['type']) && type.value)
                Application.ridb.type = type.value;

            if((limit = elements['limit']) && limit.value)
                Application.ridb.limit = limit.value;

            if((radius = elements['radius']) && radius.value)
                Application.ridb.radius = radius.value;

            processes = originalProcesses.slice();

            nextProcess();
        };

        nextProcess();
    };

    // TODO: Move to AuthenticationController (or model?) (exiquio)
    var initAuthentication = function() {
        var success = function(data) {
            Application.token = data.token;

            nextProcess();
        };

        // TODO: Replace error logging with client side notification (exiquio)
        var error = function(responseStatus) {
            var message = 'An error occurred in initAuthentication: ' +
                responseStatus;

            console.log(message);
        };

        Application.controllers.AuthenticationController
            .fetchToken(success, error);
    };

    // TODO: Move to MapController (or model?) (exiquio)
    var initMap = function() {
        // REVIEW: Should this be moved to Application.map? (exiquio)
        var coordinates = [
            parseLatitude(currentPosition),
            parseLongitude(currentPosition)
        ];
        var ZOOM_LEVEL = 8;

        map = L.map('map');
        map.setView(coordinates, ZOOM_LEVEL);

        // TODO: Obsfuscate key!!! (exiquio)
        // TODO: Change key!!! (exiquio)
        L.tileLayer('http://{s}.tiles.mapbox.com/v4/exiquio.ln3dmna1/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZXhpcXVpbyIsImEiOiJBcDQzSXZRIn0.W-EQbfDbn2qyyH1Awus19w', {
            maxZoom: 18,
            attribution: 'OpenStreetMap',
            type: 'map'
        }).addTo(map);

        Application.map = {};
        Application.map.markers = L.layerGroup([]);
        Application.map.markers.addTo(map);

        nextProcess();
    };

    var nextProcess = function() {
        app(currentPosition);
    };

    var app = function(position) {
        if(!currentPosition) currentPosition = position;

        var process = processes.pop();

        if(process) eval(process.method)(process.options);
    }

    var start = function() {
        Application.ridb = {};
        Application.ridb.type = 'facilities';

        processes = [
            {
                method: 'initRIDB',
                options: {callback: applyRIDB}
            },
            {method: 'initSettings', options: null},
            {method: 'initAuthentication', options: null},
            {method: 'initMap', options: null}
        ];

        // TODO: Redo Startup process to make geolocation optional (exiquio)
        try {
            Application.Geolocation.geolocate(app);
        } catch(error) {
            // TODO: dynamically add template to warn browser user (exiquio)
            console.log(error.message);
        }
    };

    window.onload = function() {
        start();
    };
}())

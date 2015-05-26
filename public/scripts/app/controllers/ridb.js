var Application = (function(module) {
    if(!module.controllers) { module.controllers = {} }

    module.controllers.RIDBController = {
        fetch: function(type, coordinates, successHandler, errorHandler) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        // HACK: Seems to be some kind of bug in the code.
                        // http://stackoverflow.com/questions/17345851/jquery-parsejson-returns-a-string
                        var data = JSON.parse(JSON.parse(xhr.responseText));

                        successHandler && successHandler(data);
                    } else {
                        errorHandler && errorHandler(xhr.status);
                    }
                }
            };

            ///var urlBase = 'http://reccollector.mybluemix.net/api/v1/ridb/';
            var urlBase = 'http://localhost:3001/api/v1/ridb/',
                radius = Application.ridb.radius,
                limit = Application.ridb.limit;

            var url = [
                urlBase,
                type,
                '/',
                coordinates.latitude,
                ',',
                coordinates.longitude,
                '/',
                radius,
                '/',
                limit
            ].join('');

            xhr.open('GET', encodeURI(url), true);
            xhr.setRequestHeader('x-access-token', Application.token);
            xhr.send();
        }
    };

    return module;
})(Application || {});

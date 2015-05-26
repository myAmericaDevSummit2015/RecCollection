var Application = (function(module) {
    if(!module.controllers) { module.controllers = {} }

    module.controllers.AuthenticationController = {
        fetchToken: function(successHandler, errorHandler) {
            var xhr = new XMLHttpRequest();

            xhr.onload = function() {
                var data = JSON.parse(xhr.responseText);

                successHandler && successHandler(data);
            };

            xhr.onerror = function() {
                errorHandler && errorHandler(xhr.status);
            }

            // TODO: Find a clean way to switch these
            // We could pull it from this apps own server, localhost:3000
            //var url = 'http://reccollector.mybluemix.net/api/v1/token';
            var url = 'http://localhost:3001/api/v1/token';

            xhr.open('GET', encodeURI(url));
            // FIXME: Obsfuscate
            var credentials = 'YXBpX3VzZXI6UnVieVR1ZXNkYXlDYXRJblRoZUhhdFJvY2tBbmRSb2xs';

            xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
            xhr.send();
        }
    };

    return module;
})(Application || {});

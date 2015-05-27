var Application = (function(module) {
    if(!module.controllers) { module.controllers = {} }

    module.controllers.TextToSpeechController = {
        speak: function(text) {
            var xhr = new XMLHttpRequest(),
                audioContext = new AudioContext(),
                source = audioContext.createBufferSource();

            xhr.onload = function() {
                var playAudio = function(buffer) {
                    source.buffer = buffer;
                    source.connect(audioContext.destination);

                    source.start(0);
                };

                // TODO: Handle properly (exiquio)
                // NOTE: error is being received
                var handleError = function(error) {
                    console.log('An audio decoding error occurred');
                }

                audioContext
                    .decodeAudioData(xhr.response, playAudio, handleError);
            };

            xhr.onerror = function() { console.log('An error occurred'); };

            var urlBase = 'https://reccollector.mybluemix.net/api/v1/text_to_speech/';
            //var urlBase = 'http://localhost:3001/api/v1/text_to_speech/';
            var url = [
                urlBase,
                text,
            ].join('');

            xhr.open('GET', encodeURI(url), true);
            xhr.setRequestHeader('x-access-token', Application.token);
            xhr.responseType = 'arraybuffer';
            xhr.send();
        }
    };

    return module;
})(Application || {});

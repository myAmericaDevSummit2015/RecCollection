var Application = (function(module) {
    if(!module.controllers) { module.controllers = {} }

    var xhr = new XMLHttpRequest(),
        audioContext = new AudioContext(),
        source = audioContext.createBufferSource();

    module.controllers.TextToSpeechController = {
        fetch: function() {
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

            var urlBase = 'http://localhost:3001/api/v1/text_to_speech/';
            var url = [
                urlBase,
                'test',
            ].join('');

            xhr.open('GET', encodeURI(url), true);
            xhr.setRequestHeader('x-access-token', Application.token);
            xhr.responseType = 'arraybuffer';
            xhr.send();
        }
    };

    return module;
})(Application || {});

module.exports.apply = function(app) {
    app.get('/', function(request, response) {
      response.render('index');
    });

    app.use(function(request, response, next) {
        response.status(404);
        response.send('Page Not Found :|');
    });
};

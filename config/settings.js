module.exports.apply = function(app, express) {
    require('./morgan').apply(app);

    app.set('view engine', 'jade');
    app.set('views', __base + 'views');

    app.use(express.errorHandler());
    app.use(express.static(__base + 'public'));
    app.use(app.router);
};

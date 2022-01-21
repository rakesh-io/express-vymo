const indexFunc = function(req, res, next) {
    res.render('index', { title: 'Express' });
}

module.exports = { indexFunc };
module.exports = app => {

    // Com o uso do consign, no momento que for carregado os arquivos no index.js será obtido de forma 
    // semelhante à um require    
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)


    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById)

    app.route('/categories')
        .get(app.api.category.get)
        .post(app.api.category.save)

    /* 
    A ordem das urls é importante para o express, então, getTree tem que vir antes de
    categories/:id
    */
    app.route('/categories/tree')
        .get(app.api.category.getTree)
    
    app.route('/categories/:id')
        .get(app.api.category.getById) 
        .put(app.api.category.save)
        .delete(app.api.category.remove) 

    app.route('/articles')
        .get(app.api.article.get)
        .post(app.api.article.save)
    app.route('/articles/:id')
        .get(app.api.article.getById)
        .put(app.api.article.save)
        .delete(app.api.article.remove)
    app.route('/categories/:id/articles')
        .get(app.api.article.getByCategory) 
} 
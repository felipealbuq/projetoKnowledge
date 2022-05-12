module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const category = { ...req.body }

        // Se o id vier nos parâmetros da requisição, category.id recebe req.params.id 
        if (req.params.id) category.id = req.params.id

        // Só há necessidade de uma validação nesse caso
        try {
            existsOrError(category.name, 'Nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        // Se category.id estiver setado,é necessário fazer um update em category
        if (category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            // Para ser possível a exclusão, o id tem que estar presente
            existsOrError(req.params.id, 'Código da categoria não informado')

            // Esta validação verifica se há subcategorias ou não
            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id })

            notExistsOrError(subcategory, 'Categoria possui subcategorias')

            // Além de verificar se há subcategorias, há a necessidade de verificar se há artigos
            // associados
            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria possui artigos')

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Categoria não foi encontrada')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    // withPath recebe uma lista de categorias e retorna novamente uma lista de categorias
    const withPath = categories => {
        const getParent = (categories, parentId) => {

            // Chamei a função filter que recebe uma callback e nessa callback 
            // vou receber cada uma das categorias para filtrar e saber se essa categoria tem o id
            // exateamente do parentId que estou procurando
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null

        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name

            // Quando o parent for nulo, para de montar o path
            let parent = getParent(categories, category.parentId)

            while (parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        // Para realizar a ordenação das categorias, utilizei o método sort, fazendo a ordenação
        // de uma função callback
        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1
            // Caso os dois sejam iguais, retorna 0
            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        // Obtém todas as categorias e filtra apenas a que não tem o parentId setado
        if (!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }
    return { save, remove, get, getById,getTree }
}

exports.up = function(knex, Promise) {
    return knex.schema.createTable('categories', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        
        // Auto relacionamento, uma coluna que se relaciona com a própria tabela
        // ou seja, referencia o campo id na tabela categories
        table.integer('parentId').references('id')
        .inTable('categories')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('categories')
};
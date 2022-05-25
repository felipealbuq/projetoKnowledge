const app = require('express')()
const db = require('./config/db')
const mongoose = require('mongoose')

require('./config/mongodb')

// Tendo em vista o knex já configurado pro db correto e importado no index, é possível
// usar o app.db para fazer as querys no db
app.db = db
app.mongoose = mongoose
// Utilizei o consign para ajudar a fazer as dependências dentro da aplicação e não precisar 
// utilizar todos os require de todos os arquivos da aplicação
const consign = require('consign')
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js') 
    .then('./api') 
    .then('./schedule')
    .then('./config/routes.js')
    
    // injeta em cada uma das dependências que vão ser carregadas, como parâmetro, no app
    .into(app)

app.listen(3000,()=>{
    console.log('Backend executando...')
})


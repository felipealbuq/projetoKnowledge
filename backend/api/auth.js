const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    // singin também é uma função middleware que recebe requisição e resposta
    const signin = async(req,res) =>{
        if (!req.body.email || !req.body.password){
            // Se qualquer um dos dois não estiver presente, sai do método informando erro 400
            // pedindo para o usuário informar o usuário e a senha 
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({email:req.body.email})
            .first()
        
         // Se esse usuário não existir, significa que está tentando se logar com email que
         // não está cadastrado
         if (!user) return res.status(400).send('Usuário não encontrado!')

         // Comparando as senhas colocadas pelo o usário para saber se tem match, como a senha 
         // é gerada a partir do hash do bcrypt, utilizei uma função própria de comparação 
         const isMatch = bcrypt.compareSync(req.body.password, user.password)
         
         // Se não der match, o usuário não está autorizado e retorna o erro 401
         if (!isMatch) return res.status(401).send('Email/senha inválidos!')

         // Gerando token de validade
         const now = Math.floor(Date.now() / 1000) 

         const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
         }

         res.json({
            ...payload,

            // Qualquer nova requisição terá um cabeçalho chamdo "authorization" para 
            // validação do token
            token: jwt.encode(payload,authSecret)
         })

    }

    const validateToken = async (req,res) =>{
        const userData = req.body || null
        try {
            if (userData){
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()){
                    return res.send(true)
                }

            }
        } catch(e){
            // problema com o token
        }
        res.send(false)
    }

    return {signin, validateToken}

}
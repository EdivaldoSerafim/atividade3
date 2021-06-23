var express = require('express');
var router = express.Router();
const Link = require('../models/link');

/********************************************************************************************* */

/* Um método que retorna uma url encurtada conforme o encurtamento da URL. /*

/* Rota para ver os redirecionamentos */
router.get('/:code/stats', async(req, res, next) => {
        const code = req.params.code;

        const resultado = await Link.findOne({ where: { code } });
        if (!resultado) return res.sendStatus(404);
        res.render('stats', resultado.dataValues);
    })
    /********************************************************************************************* */

/* Um método que retorna uma url encurtada conforme um id. */

/* Rota para redirecionar o usuário conforne o id (code)  */
router.get('/:code', async(req, res, next) => {
    const code = req.params.code;

    const resultado = await Link.findOne({ where: { code } });
    if (!resultado) return res.sendStatus(404);

    resultado.hits++;
    await resultado.save();

    res.redirect(resultado.url);
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Encurtador Unyleya' });
});

/********************************************************************************************* */

/* Um método de encurtar uma URL persistindo-a no banco de dados. */

//função para encurtar a url
function generateCode() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

//rota para encurtar o método que encurta a URL e salvar no banco
router.post('/new', async(req, res, next) => {
    const url = req.body.url;
    const code = generateCode();

    let date_ob = new Date();
    let dat = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    const date = year + "-" + month + "-" + dat

    const resultado = await Link.create({
        url,
        code,
        date
    })

    res.render('stats', resultado.dataValues);
    //res.send('http://localhost:3000/' + code);
});

/********************************************************************************************* */

/* um método que retorna todas as URLs encurtadas em uma data específica. */
router.post('/date', async(req, res, next) => {
    const date = req.body.date;

    const resultado = await Link.findAll({
        where: {
            date
        },
    });

    if (!resultado) return res.send("Sem URLs para a data: " + date);

    res.send(JSON.stringify(resultado));
    console.log(JSON.stringify(resultado));

});


module.exports = router;
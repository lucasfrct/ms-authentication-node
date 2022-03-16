const handle            = require('@ms-utils-node/src/core/handle');
const logger            = require('@ms-utils-node/src/core/logger-handler');
const Err               = require('@ms-utils-node/src/core/error-handler');
const TemplateEquals    = require('@ms-utils-node/src/core/template-equals');

const Authentication = require('../authentication/Authentication');
const e = require('cors');

const AuthenticateMiddleware = async(req, res, next) => {
    try {
        const auth = new Authentication;
        const { cipher } = req.body;

        if(!cipher) {
            logger.error({
                status: "AU0001", 
                message: 'Não foi possível comprovar autenticidade da requisição.' 
            }) 
            return res.status(401).json({ message: 'Não foi possível comprovar autenticidade da requisição.' });
        };

        const payload = await auth.ratify(cipher);
        if(!payload) {
            logger.error({
                error: e,
                status: "AU000", 
                message: "Não foi possível capturar os inputs da requisição." 
            });
            return res.status(422).json({ message: "Não foi possível capturar os inputs da requisição." });
        };

        req.claims = payload;

        return next();

    } catch (err) {
        logger.error({ 
            error: err,
            message: "Servidor indisponível no momento. Tente mais tarde." 
        });
        return res.status(500).json({ message: "Servidor indisponível no momento. Tente mais tarde." });
    }

}

module.exports = AuthenticateMiddleware;
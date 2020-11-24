const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
    username: Joi.string().alphanum().required(),
    subject: Joi.string().required(),
    msg: Joi.string().max(500).required(),
    imgURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    })
});

const messages = db.get('messages');

function getAll(){
    return messages.find();
}

function create(msg) {
    if(!msg.username) msg.username = 'Annonymous';
    const result = schema.validate(msg);

    if(result.error == null) {
        msg.created = new Date();
        return messages.insert(msg);
    }
    else {
        return Promise.reject(result.error);
    }
}

module.exports = {
    getAll,
    create

};


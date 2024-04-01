const db = require('../config/db');
const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');

const result = { error: null, data: null };

exports.list = async (req,res) =>{
    try{
        const data = await db('utilisateur').select('id-utilisateur', 'pseudo');
        res.status(200).json({...result,data:data});
    } catch(err){
        res.json({ ...result, error: err });
    }
};

exports.create = async(req,res)=>{
try{
        const {pseudo, password} =req.body
        const exists = await db('utilisateur').where('pseudo', pseudo).select('id-utilisateur')
        if(exists.length > 0 )
            return res.json({ ...result, error: { err: "L'utilisateur spécifié existe déja", added: false } });
            const id_utilisateur = v4();
            await db('utilisateurs').insert({
                id_utilisateur,
                pseudo,
                password: bcrypt.hashSync(password),
            });
            res.status(200).json({ ...result, data: { added: true } });
} catch {
    res.json({ ...result, error: { ...err, added: false } });
}
}
exports.update = async (req, res) => {
	try {
		const { id } = req.params;
		const exists = await db('utilisateurs').where('id_utilisateur', id).select('id_utilisateur');
		if (exists.length === 0)
			return res.json({ ...result, error: { err: "L'utilisateur spécifié n'existe pas", updated: false } });

		const { pseudo, password } = req.body;
		let newData = {};
		if (pseudo !== undefined) newData = { ...newData, pseudo };
		if (password !== undefined) newData = { ...newData, password: bcrypt.hashSync(password) };

		await db('utilisateurs').where('id_utilisateur', id).update(newData);
		res.status(200).json({ ...result, data: { updated: true } });
	} catch (err) {
		console.log(err);
		res.json({ ...result, error: { ...err, updated: false } });
	}
};

exports.remove = async (req, res) => {
	try {
		const { id } = req.params;
		const exists = await db('utilisateurs').where('id_utilisateur', id).select('id_utilisateur');
		if (exists.length === 0)
			return res.json({ ...result, error: { err: "L'utilisateur spécifié n'existe pas", deleted: false } });

		await db('utilisateurs').where('id_utilisateur', id).del();
		res.status(200).json({ ...result, data: { deleted: true } });
	} catch (err) {
		console.log(err);
		res.json({ ...result, error: { ...err, deleted: false } });
	}
};

const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
const moment = require('moment');
const multer = require('multer');

const result = { error: null, data: null };

exports.list = async (req, res) => {
	try {
		const data = await db('commandes').select('*');
		res.status(200).json({ ...result, data: data });
	} catch (err) {
		res.json({ ...result, error: err });
	}
};

exports.create = async (req, res) => {
	try {
		const id_commande = v4();
		const dirName = path.join(__dirname, 'uploads/commandes');

		console.log(dirName);

		try {
			if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
				fs.mkdirSync(path.join(__dirname, 'uploads'));
			}

			if (!fs.existsSync(dirName)) {
				fs.mkdirSync(dirName);
			}

			fs.mkdirSync(path.join(dirName, id_commande));
		} catch (err) {
			return res.send(err);
		}

		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, path.join(dirName, id_commande));
			},
			filename: function (req, file, cb) {
				cb(null, file.originalname);
			},
		});

		const upload = multer({ storage: storage });

		upload.single('file')(req, res, async (err) => {
			if (err) {
				console.log(err);
				return res.send({ ...result, error: { ...err, added: false } });
			}

			const { nom, prenom, tel, email, photoName, montant } = req.body;
			try {
				await db('commandes').insert({
					id_commande,
					nom,
					prenom,
					tel,
					email,
					photo: photoName,
					montant,
					date_lancee: moment(),
				});
			} catch (err) {
				console.log(err);
				return res.send({ ...result, error: { ...err, added: false } });
			}
		});

		res.status(200).json({ ...result, data: { added: true } });
	} catch (err) {
		res.json({ ...result, error: { ...err, added: false } });
	}
};

exports.update = async (req, res) => {
	try {
		const { id } = req.params;
		const exists = await db('commandes').where('id_commande', id).select('id_commande');
		if (exists.length === 0)
			return res.json({ ...result, error: { err: "La commande spécifié n'existe pas", updated: false } });

		const { reglee, archivee } = req.body;
		let newData = {};
		if (reglee !== undefined) newData = { ...newData, reglee, date_reglee: moment() };
		if (archivee !== undefined) newData = { ...newData, archivee, date_archivee: moment() };

		await db('commandes').where('id_commande', id).update(newData);
		res.status(200).json({ ...result, data: { updated: true } });
	} catch (err) {
		console.log(err);
		res.json({ ...result, error: { ...err, updated: false } });
	}
};

exports.remove = async (req, res) => {
	try {
		const { id } = req.params;
		const exists = await db('commandes').where('id_commande', id).select('id_commande');
		if (exists.length === 0)
			return res.json({ ...result, error: { err: "La commande spécifié n'existe pas", deleted: false } });

		await db('commandes').where('id_commande', id).del();
		res.status(200).json({ ...result, data: { deleted: true } });
	} catch (err) {
		console.log(err);
		res.json({ ...result, error: { ...err, deleted: false } });
	}
};

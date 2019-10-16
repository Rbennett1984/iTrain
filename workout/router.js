const express = require('express');

const config = require('../config');

const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Workout} = require('./models');

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	Workout
		.find()
		.exec()
		.then(plants => {
			res.status(200).json(plants)
		})
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		})
});

router.get('/user/:user', passport.authenticate('jwt', {session: false}), (req, res) => {
	Workout
		.find({user: `${req.params.user}`})
		.exec()
		.then(workout => {
			res.status(200).json(workout)
		})
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		})
});

router.get('/:id', (req, res) => {
	Workout
		.findById(req.params.id)
		.exec()
		.then(workout => res.status(200).json(plant))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'})
		})
})

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['user', 'name', 'startDate'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = Workout.create({
		user: req.body.user,
		name: req.body.name, 
		startDate: req.body.startDate,
		finishDate: req.body.harvestDate,
		comments: req.body.comments
	});
	res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['name', 'startDate'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating workout item ${req.params.id}`);
	Workout
		.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
		.exec()
		.then(plant => res.status(200).json(plant))
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		});
});

router.delete('/:id', (req, res) => {
	Workout
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(() => res.status(204).end())
		.catch(err => {
			res.status(500).json({message: 'Internal server error'});
		})
});

router.use('*', (req, res) => {
	res.status(404).send('URL Not Found');
});

module.exports = {router};
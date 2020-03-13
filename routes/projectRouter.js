const express = require('express')

const projectdb = require('../data/helpers/projectModel')

const router = express.Router()

router.use('/:id', validateId)

router.get('/:id', (req, res) => {
    projectdb.get(req.params.id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                Message: 'Could not find your information'
            })
        })
})

router.get('/', (req, res) => {
    projectdb.get()
        .then(user => {
            res.status(200).json({ user })
        })
        .catch(err => {
            res.status(500).json({ Message: 'couldnt find your stuff' })
        })
})


router.get('/:id/actions', (req, res) => {
    projectdb.getProjectActions(req.params.id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({
                Message: 'Could not find your information'
            })
        })
})

router.post('/', (req, res) => {
    projectdb.get()
        .then(user => {
            if (!req.body.name || !req.body.description || req.body.completed) {
                res.status(400).json({
                    Message: 'missing a field'
                })
            } else {
                projectdb.insert(req.body)
                    .then(user => {
                        res.status(201).json(user)
                    })
                    .catch(err => {
                        res.status(500).json({
                            Message: 'failed to complete post'
                        })
                    })
            }
        })
        .catch(err => {
            res.status(500).json({ Message: 'Something went wrong!' })
        })
})

router.put('/:id', (req, res) => {
    projectdb.get(req.params.id)
        .then(user => {
            if (user.length === 0) {
                res.status(404).json({
                    Message: 'could not make post'
                })
            } else if (!req.body.name || !req.body.description || req.body.completed) {
                res.status(400).json({
                    Message: 'missing a field'
                })
            } else {
                projectdb.update(req.params.id, req.body)
                    .then(user => {
                        res.status(201).json(req.body)
                    })
                    .catch(err => {
                        res.status(500).json({
                            Message: 'failed to complete post'
                        })
                    })
            }
        })
        .catch(err => {
            res.status(500).json({ Message: 'these are not the droids you are looking for' })
        })
})

router.delete('/:id', (req, res) => {
    projectdb.remove(req.params.id)
        .then(user => {
            res.status(200).json({ message: 'project has been delted with.', project: req.user })
        })
})






function validateId(req, res, next) {
    // do your magic!
    const id = req.params.id
    projectdb.get(id)
        .then(user => {
            if (!user) {
                res.status(400).json({
                    Message: 'The user doesnt exist'
                })
            } else {
                req.user = user
                next()
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                Message: 'couldnt validate'
            })
        })
}

module.exports = router
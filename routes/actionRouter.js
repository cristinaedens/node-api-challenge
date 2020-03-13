const express = require('express')

const actiondb = require('../data/helpers/actionModel')

const router = express.Router()

router.use('/:id', validateId)

router.get('/:id', (req, res) => {
    actiondb.get(req.params.id)
        .then(user => {
            res.status(200).json(req.user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ Message: 'Could not find your information' })
        })
})

router.post('/', (req, res) => {
    actiondb.get()
        .then(user => {
            if (!req.body.project_id || !req.body.description || req.body.completed) {
                res.status(400).json({
                    Message: 'missing a field'
                })
            } else {
                actiondb.insert(req.body)
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
    actiondb.get(req.params.id)
        .then(user => {
            if (user.length === 0) {
                res.status(404).json({
                    Message: 'could not make post'
                })
            } else if (!req.body.project_id || !req.body.description || req.body.completed) {
                res.status(400).json({
                    Message: 'missing a field'
                })
            } else {
                actiondb.update(req.params.id, req.body)
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
            res.status(500).json({ Message: 'this is an error message' })
        })
})

router.delete('/:id', (req, res) => {
    actiondb.remove(req.params.id)
        .then(user => {
            res.status(200).json({ message: 'project has been deleted', project: req.user })
        })
})


function validateId(req, res, next) {
    // do your magic!
    const id = req.params.id
    actiondb.get(id)
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
                Message: ' can not validate'
            })
        })
}




module.exports = router
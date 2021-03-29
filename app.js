const express = require('express');
const app = express();
const morgan = require('morgan')
const {success, error, getIndex, createID} = require('./functions/functions')
const bodyParser = require('body-parser')
const {members} = require('./data/member')
const config = require('./config')


let MembersRouter = express.Router();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

MembersRouter.route('/')
    //Get all members
    .get((req, res) => {
        if(req.query.max !== undefined && req.query.max > 0) {
            res.json(success(members.slice(0, req.query.max)))
        } else if (req.query.max !== undefined) {
            res.json(error('Wrong max value !'))
        } else {
            res.json(success(members))
        }
    })

    //Add new member
    .post((req, res) => {
        if(req.body.name) {
            let sameName = false
            for (let i = 0; i < members.length; i++) {
                if (members[i].name === req.body.name) {
                    sameName = true;
                    break
                }
            }

            if (sameName) {
                res.json(error('name already taken'))
            } else {
                let member = {
                    id: createID(),
                    name: req.body.name
                }
                members.push(member);
                res.json(success(member))
            }
        } else {
            res.json(error('No name value'))
        }
    })

MembersRouter.route('/:id')
    //Get a member with his ID
    .get((req, res) => {
        let index = getIndex(req.params.id)
        if (typeof index === 'string') {
            res.json(error(index))
        } else {
            res.json(success(members[index].name))
        }
    })

    //Update a member with his ID
    .put((req, res) => {
        let index = getIndex(req.params.id)
        if (typeof index === 'string') {
            res.json(error(index))
        } else {
            let same = false

            for (let i = 0; i < members.length; i++) {
                if (req.body.name === members[i].name && req.params.id != members[i].id) {
                    same = true
                    break
                }
            }

            if (same) {
                res.json(error('same name'))
            } else {
                members[index].name = req.body.name
                res.json(success(true))
            }
        }
    })

    //Delete a member with his ID
    .delete((req, res) => {
        let index = getIndex(req.params.id)
        if(typeof index === 'string') {
            res.send(error(index))
        } else {
            members.splice(index, 1)
            res.send(success(members))
        }
    })

app.use(config.rootAPI + 'members', MembersRouter)

app.listen(config.port, () => {
    console.log('Started on port ' + config.port)
})
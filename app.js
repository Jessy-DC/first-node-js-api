const express = require('express');
const app = express();
const mysql = require('promise-mysql')
const morgan = require('morgan')('dev')
const {success, error, checkAndChange} = require('./functions/functions')
const bodyParser = require('body-parser')
const {members} = require('./data/member')
const config = require('./assets/config.json')

mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
}).then((db) => {
    console.log('Connected.')

    let MembersRouter = express.Router();
    let Members = require('./assets/classes/members-class')(db, config)

    app.use(morgan)
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    MembersRouter.route('/')
        //Get all members
        .get(async(req, res) => {
            let allMembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })

        //Add new member
        .post(async (req, res) => {
            let memberAdded = await Members.addMember(req.body.name)
            res.json(checkAndChange(memberAdded))
        })

    MembersRouter.route('/:id')
        //Get a member with his ID
        .get(async (req, res) => {
            let member = await Members.getByID(req.params.id)
            res.json(checkAndChange(member))
        })

        //Update a member with his ID
        .put(async(req, res) => {
            let memberUpdated = await Members.updateMember(req.params.id, req.body.name)
            res.json(checkAndChange(memberUpdated))
        })

        //Delete a member with his ID
        .delete((req, res) => {
            db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                if (err) {
                    res.json(error(err.message))
                } else {
                    if (result[0] !== undefined) {
                        db.query('DELETE FROM members WHERE id = ?', [req.params.id], (err, result) => {
                            if (err) {
                                res.json(error(err.message))
                            } else {
                                res.json(success(true))
                            }
                        })
                    } else {
                        res.json(error('Wrong id'))
                    }
                }
            })
        })

    app.use(config.rootAPI + 'members', MembersRouter)

    app.listen(config.port, () => {
        console.log('Started on port ' + config.port)
    })
}).catch((err) => {
    console.error('Error during database connection')
})
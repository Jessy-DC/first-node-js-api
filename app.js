const express = require('express');
const app = express();
const mysql = require('mysql')
const morgan = require('morgan')
const {success, error, getIndex, createID} = require('./functions/functions')
const bodyParser = require('body-parser')
const {members} = require('./data/member')
const config = require('./config')

const db = mysql.createConnection({
    host: 'localhost',
    database: 'nodejs',
    user: 'root',
    password: ''
})

db.connect((err) => {
    if(err) {
        console.error(err.message)
    } else {
        console.log('Connected.')
        let MembersRouter = express.Router();

        app.use(morgan('dev'))
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        MembersRouter.route('/')
            //Get all members
            .get((req, res) => {
                if(req.query.max !== undefined && req.query.max > 0) {
                    db.query('SELECT * FROM members LIMIT 0, ?',[req.query.max], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            res.json(success(result))
                        }
                    })
                } else if (req.query.max !== undefined) {
                    res.json(error('Wrong max value !'))
                } else {
                    db.query('SELECT * FROM members', (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            res.json(success(result))
                        }
                    })
                }
            })

            //Add new member
            .post((req, res) => {
                if(req.body.name) {
                    db.query('SELECT * FROM members WHERE name = ?', [req.body.name], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            if(result[0] !== undefined) {
                                res.json(error('name already taker'))
                            } else {
                                db.query("INSERT INTO members(name) VALUES(?)", [req.body.name], (err, result) => {
                                    if (err) {
                                        res.json(error(err.message))
                                    } else {
                                        res.json(
                                            success({
                                                id: result.insertId,
                                                name: req.body.name,
                                            })
                                        )
                                    }
                                })
                            }
                        }
                    })
                } else {
                    res.json(error('No name value'))
                }
            })

        MembersRouter.route('/:id')
            //Get a member with his ID
            .get((req, res) => {
                db.query('SELECT * FROM members WHERE ID = ?',[req.params.id], (err, result) => {
                    if (err) {
                        res.json(error(err.message))
                    } else {
                        if (result[0] !== undefined) {
                            res.json(success(result[0]))
                        } else {
                            res.json(error('Wrong id value'))
                        }
                    }
                })
            })

            //Update a member with his ID
            .put((req, res) => {
                if (req.body.name) {
                    db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {
                            if (result[0] !== undefined) {
                                db.query('SELECT * FROM members WHERE name = ? AND id != ?', [req.body.name, req.params.id], (err, result) => {
                                    if (err) {
                                        res.json(error(err.message))
                                    } else {
                                        if (result[0] !== undefined) {
                                            res.json(error('same name'))
                                        } else {
                                            db.query('UPDATE members SET name = ? WHERE id = ?', [req.body.name, req.params.id], (err, result) => {
                                                if (err) {
                                                    res.json(error(err.message))
                                                } else {
                                                    res.json(success(true))
                                                }
                                            })
                                        }
                                    }
                                })
                            } else {
                                res.json(error('Wrong id'))
                            }
                        }
                    })
                } else {
                    res.json(error('no name value'))
                }
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
    }
})
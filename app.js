const express = require('express');
const app = express();
const morgan = require('morgan')
const functions = require('./functions/functions')

const members = [
    {
        id: 1,
        name: 'John'
    },
    {
        id: 2,
        name: 'Jessy'
    },
    {
        id: 3,
        name: 'Jack'
    }
]

app.use(morgan('dev'))

app.get('/api/v1/members/:id', (req, res) => {
    res.json(functions.success(members[req.params.id - 1].name))
})

app.get('/api/v1/members', (req, res) => {
    if(req.query.max !== undefined && req.query.max > 0) {
        res.json(functions.success(members.slice(0, req.query.max)))
    } else if (req.query.max !== undefined) {
        res.json(functions.error('Wrong max value !'))
    } else {
        res.json(functions.success(members))
    }
})

app.listen(8080, () => {
    console.log('Started')
})
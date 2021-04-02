// Modules
require('babel-register')
const bodyParser = require('body-parser')
const express = require('express');
const morgan = require('morgan')('dev')
const axios = require('axios')
const twig = require('twig')

//Global var
const app = express()
const port = 8081
const fetch = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
})

//Middlewares
app.use(morgan)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Routes

//Homepage
app.get('/', (req, res) => {
    res.redirect('/members')
})

//Page for display all members
app.get('/members', ((req, res) => {
    let url = req.query.max ? '/members?max=' + req.query.max : '/members'
    apiCall(url,'get', {}, res, (result) => {
        res.render('members.twig', {
            members: result
        })
    })
}))

app.get('/members/:id', (req, res) => {
    apiCall('/members/' + req.params.id,'get', {}, res, (result) => {
        res.render('member.twig', {
            member: result
        })
    })
})

app.get('/edit/:id', ((req, res) => {
    apiCall('/members/' + req.params.id, 'get', {}, res, (result) => {
        res.render('edit.twig', {
            member: result
        })
    })
}))

//Update a member
app.post('/edit/:id', ((req, res) => {
    apiCall('/members/' + req.params.id, 'put', { name: req.body.name}, res, () => {
        res.redirect('/members')
    })
}))

app.post('/delete', ((req, res) => {
    apiCall('/members/' + req.body.id, 'delete', {}, res, () => {
        res.redirect('/members')
    })
}))

//Page for add a member
app.get('/insert', ((req, res) => {
    res.render('insert.twig')
}))

//Method for add member
app.post('/insert', (req, res) => {
    apiCall('/members', 'post', {name: req.body.name}, res, (result) => {
        res.redirect('/members')
    })
})

//Run app
app.listen(port, () => console.log('Started on port ' + port))

function renderError(res, errorMsg) {
    res.render('error.twig', {
        errorMsg: errorMsg
    })
}

function apiCall(url, method, data, res, next) {
    fetch({
        method: method,
        url: url,
        data: data
    })
        .then((response) => {
            if(response.data.status === 'success') {
                next(response.data.result)
            } else {
                renderError(res, response.data.message)
            }
        })
        .catch((err) => {
            renderError(res, err.message)
        })
}
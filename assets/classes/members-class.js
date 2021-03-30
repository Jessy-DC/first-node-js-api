let db, config

module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Members
}

let Members = class {
    static getByID(id) {
        return new Promise((next) => {
            db.query('SELECT * FROM members WHERE ID = ?', [id])
                .then((result) => {
                    if (result[0] !== undefined)
                        next(result[0])
                     else
                        next(new Error('Wrong id'))
                })
                .catch((err) => next(err))
        })
    }

    static getAll(max) {
        return new Promise((next) => {
            if(max !== undefined && max > 0) {
                db.query('SELECT * FROM members LIMIT 0, ?',[parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if (max !== undefined) {
                next(new Error('Wrong max value'))
            } else {
                db.query('SELECT * FROM members')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            }
        })
    }

    static addMember(name) {
        return new Promise((next) => {
            if(name && name.trim() !== '') {
                name = name.trim()
                db.query('SELECT * FROM members WHERE name = ?', [name])
                    .then((result) => {
                        if(result[0] !== undefined) {
                            next(new Error('name already taker'))
                        } else {
                            return db.query("INSERT INTO members(name) VALUES(?)", [name])
                        }
                    })
                    .then((result) => {
                        next({
                                id: result.insertId,
                                name: name,
                            }
                        )
                    })
                    .catch((err) => next(err))
            } else {
                next(new Error('No name value'))
            }
        })
    }

    static updateMember(id, name) {
        return new Promise((next) => {
            if(name && name.trim() !== '') {
                db.query('SELECT * FROM members WHERE id = ?', [id])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name, id])
                        } else {
                            next(new Error('Wrong id'))
                        }
                    })
                    .then((result) => {
                        if (result[0] !== undefined) {
                            next(new Error('same name'))
                        } else {
                            return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id])
                        }
                    })
                    .then(() => {
                        next(true)
                    })
                    .catch((err) => next(err))
            } else {
                next(new Error('no name value'))
            }
        })
    }
}
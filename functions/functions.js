const {members} = require('../data/member')

exports.success = function(result) {
    return {
        'status': 'success',
        'result': result
    }
}

exports.error = function(result) {
    return {
        'status': 'error',
        'message': result
    }
}

exports.getIndex = function (id) {
    for (let i = 0; i < members.length; i++) {
        if(members[i].id == id)
            return i
    }
    return 'wrong id'
}

exports.createID = function() {
    return members[members.length - 1].id + 1
}

exports.isErr = (err) => {
    return err instanceof Error;
}

exports.checkAndChange = (obj) => {
    if (this.isErr(obj)) {
        return this.error(obj.message)
    } else {
        return this.success(obj)
    }
}
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
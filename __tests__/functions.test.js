const functions = require('../functions/functions')

describe('test api calls', () => {
    test('should return success with object', () => {
        let promise = new Promise(((resolve, reject) => {
            setTimeout(() => {
                let responseData = fetch('/api/v1/members/');
                resolve(responseData)
            }, 1000)
        }))
        let expected = {
            'status': 'success',
            'result': 'Jessy'
        }
        promise.then(responseData => {
            expect(functions.success(responseData)).toEqual(expected)
        });
    })

    test('should return error with message', () => {
        let promise = new Promise(((resolve, reject) => {
            setTimeout(() => {
                let responseData = fetch('/api/v1/members?max=');
                resolve(responseData)
            }, 1000)
        }))
        let expected = {
            'status': 'error',
            'message': 'Wrong max value !'
        }
        promise.then(responseData => {
            expect(functions.success(responseData)).toEqual(expected)
        });
    })
})

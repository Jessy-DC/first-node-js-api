const {success, error, getIndex, createID} = require('../functions/functions')
const {members} = require('../data/member')

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
            expect(success(responseData)).toEqual(expected)
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
            expect(error(responseData)).toEqual(expected)
        });
    })
})

describe('test functions for index and ID', () => {
    test('should return index of given member', () => {
        let idMember = 2;
        expect(getIndex(idMember)).toBe(1)
    })

    test('should return last id of members with an increment of 1', () => {
        let lastId = members[members.length - 1].id
        let expectedResult = ++lastId
        expect(createID()).toBe(expectedResult)
    })
})

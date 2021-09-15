const User = require('../app/models/User')

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExit = await checkUserEmail(email)
            if (isExit) {
                let user = await User.findOne({email: email}, ['email', 'password'])
                if (user) {
                    let check = await checkUserPassword(password, user.password)

                    if (check) {
                        // khong truyen password ve
                        userData.errCode = 0
                        userData.errMessage = `OK`
                        userData.user = {
                            email: user.email,
                        }
                    } else {
                        userData.errCode = 3
                        userData.errMessage = `Wrong password!`
                    }
                } else {
                    userData.errCode = 2
                    userData.errMessage = `This user isn't exist!`
                }
            } else {
                userData.errCode = 1
                userData.errMessage = `Your email isn't exist. Please try another email!`
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserPassword = (enterPassword, userPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userPassword === enterPassword) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({email: userEmail})
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
}

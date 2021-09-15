const userService = require('../../service/userService')
class UserController {
    async handleLogin(req, res) {
        let email = req.body.email
        let password = req.body.password

        if (!email || !password) {
            return res.status(500).json({
                errCode: 1,
                errMessage: 'Missing inputs parameter!',
            })
        }

        let userData = await userService.handleUserLogin(email, password)
        return res.status(200).json({
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : {},
        })
    }
}

module.exports = new UserController()

const device_typeRouter = require("./device_type")
const userRouter = require("./user")

function route(app) {
    app.use("/", device_typeRouter)
    app.use("/api", userRouter)
}

module.exports = route

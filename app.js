require("dotenv").config()
const ExcelService = require("./app/service/ExcelService")
const logger = require("my-custom-logger")
const version = require("./package").version

const fastify = require("fastify")({
    logger: true
})

const excelService = new ExcelService()

const Routes = require("./app/routes")
Routes({fastify, excelService})

fastify.listen(5000, "0.0.0.0", (err) => {
    logger.info(`Excel v${version} service started`)
    if (err) throw err
})


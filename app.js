const ExcelService = require("./app/service/ExcelService")
const fastify = require("fastify")({
    logger: true
})

const excelService = new ExcelService()

const Routes = require("./app/routes")
Routes({fastify, excelService})

fastify.listen(5000, "0.0.0.0", (err) => {
    if (err) throw err
})


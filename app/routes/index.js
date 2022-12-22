const ValidationUtils = require("../util/validation.util")
const fs = require("fs")
const crypto = require("crypto")
const LRU = require("lru-cache")
const logger = require("my-custom-logger")

const randomBytes = async (length) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buf) => {
            if (err) {
                reject(err)
            } else {
                resolve(buf)
            }
        })
    })
}


const options = {
    maxAge: 1000 * 60 * 60 * 24 * 31,
    max: 50000
}

const cache = new LRU(options)

function Routes({fastify, excelService, pdfService}) {

    const generateExcel = async (request, reply) => {
        logger.debug("Request for generating report: " + request.body)

        if (!ValidationUtils.validateGenerateExcelRequest(request.body)) {
            return reply.code(400).send(undefined)
        }

        const wb = await excelService.generateFromRawData(request.body)

        const idBuf = await randomBytes(16)
        const id = idBuf.toString("hex")
        cache.set(id, wb)

        reply.type("application/json").code(200).send({id})

        return logger.info("Successfully generated report #" + id)
    }

    const generatePdf = async (request, reply) => {
        logger.info("Request for generating report: " + request.body)
        const idBuf = await randomBytes(16)
        const id = idBuf.toString("hex")
        const wb = await pdfService.generateFromRawData(request.body, id)

        cache.set(id, wb)
        reply.type("application/json").code(200).send({id})


        return logger.info("Successfully generated report #" + id)

    }
    const generateSwiftPdf = async (request, reply) => {
        logger.info("Request for generating report: " + request.body)
        const idBuf = await randomBytes(16)
        const id = idBuf.toString("hex")
        const wb = await pdfService.generateSwiftFromRawData(request.body, id)

        cache.set(id, wb)
        reply.type("application/json").code(200).send({id})


        return logger.info("Successfully generated report #" + id)

    }
    const generateAct = async (request, reply) => {
        logger.info("Request for generating act: " + request.body)
        const idBuf = await randomBytes(16)
        const id = idBuf.toString("hex")
        const wb = await pdfService.generateActFromRawData(request.body, id)

        cache.set(id, wb)
        reply.type("application/json").code(200).send({id})


        return logger.info("Successfully generated act #" + id)

    }

    const readFile = (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, buffer) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(buffer)
                }
            })
        })
    }


    const getFile = async (request, reply) => {
        const {id} = request.params

        const wb = cache.get(id)

        if (!wb) {
            return reply.code(404).send(undefined)
        }

        const fileName = `/tmp/report-${id}.xlsx`

        await excelService.writeToFilePromise(wb, fileName)

        const fileBuf = await readFile(fileName)


        reply.code(200)
            .type("application/octet-stream")
            .header(`Content-Disposition`, `attachment; filename="filename.xlsx"`)
            .send(fileBuf)

        return logger.info("Request for download report #" + id + " successfully processed")
    }

    const getPdfFile = async (request, reply) => {
        const {id} = request.params

        const wb = cache.get(id)

        if (!wb) {
            return reply.code(404).send(undefined)
        }

        const fileName = `/tmp/order-${id}.pdf`
        const fileBuf = await readFile(fileName)


        reply.code(200)
            .type("application/pdf")
            .header(`Content-Disposition`, `attachment; filename="order-${wb.orderNumber}.pdf"`)
            .send(fileBuf)

        return logger.info("Request for download report #" + id + " successfully processed")
    }

    const getActFile = async (request, reply) => {
        const {id} = request.params

        const wb = cache.get(id)

        if (!wb) {
            return reply.code(404).send(undefined)
        }

        const fileName = `/tmp/act-${id}.pdf`
        const fileBuf = await readFile(fileName)


        reply.code(200)
            .type("application/pdf")
            .header(`Content-Disposition`, `attachment; filename="act-${wb.id}.pdf"`)
            .send(fileBuf)

        return logger.info("Request for download report #" + id + " successfully processed")
    }


    const status = async (request, reply) => {
        reply.type("application/json").code(200)
        return {health: "OK"}
    }

    fastify.post("/api/v1/excel/generate", generateExcel)
    fastify.get("/api/v1/excel/:id", getFile)
    fastify.post("/api/v1/pdf/generate", generatePdf)
    fastify.post("/api/v1/pdf/generateSwift", generateSwiftPdf)
    fastify.post("/api/v1/pdf/generateAct", generateAct)
    fastify.get("/api/v1/pdf/:id", getPdfFile)
    fastify.get("/api/v1/pdf/act/:id", getActFile)
    fastify.get("/api/v1/status", status)

}

module.exports = Routes

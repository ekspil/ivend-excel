const ValidationUtils = require("../util/validation.util")
const fs = require('fs')
const crypto = require('crypto');
const LRU = require("lru-cache")

const randomBytes = async (length) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buf) => {
            if (err) {
                reject(err)
            } else {
                resolve(buf)
            }
        });
    })
}


const options = {
    maxAge: 1000 * 60 * 60,
    max: 500
}

const cache = new LRU(options)

function Routes({fastify, excelService}) {

    const generateExcel = async (request, reply) => {
        console.log(request.body)

        if (!ValidationUtils.validateGenerateExcelRequest(request.body)) {
            return reply.code(400).send(undefined)
        }

        const wb = await excelService.generateFromRawData(request.body)

        const idBuf = await randomBytes(16)
        const id = idBuf.toString("hex")
        cache.set(id, wb)


        return reply.type("application/json").code(200).send({id})
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
        const {filename} = request.headers

        const wb = cache.get(id)

        if (!wb) {
            return reply.code(404).send(undefined)
        }

        const fileName = `/tmp/report-${id}.xlsx`

        await excelService.writeToFilePromise(wb, fileName)

        const fileBuf = await readFile(fileName)

        return reply.code(200)
            .type('application/octet-stream')
            .header(`Content-Disposition`, `attachment; filename="filename.xlsx"`)
            .send(fileBuf)
    }


    fastify.post("/api/v1/excel/generate", generateExcel)
    fastify.get("/api/v1/excel/:id", getFile)

}

module.exports = Routes

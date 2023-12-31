/**
 *
 * @param body String[][]
 * @returns {*}
 */
function validateGenerateExcelRequest(body) {
    if (!body || !Array.isArray(body) || body.length === 0) {
        return false
    }

    return body.every((row) => {
        if (!Array.isArray(row) || row.length === 0) {
            return false
        }

        return row.every(() => {
            //return typeof cell === "string"
            return true
        })
    })
}

module.exports = {validateGenerateExcelRequest}

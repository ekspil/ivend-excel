const XLSX = require("xlsx")

class ExcelService {


    constructor() {
        this.generateFromRawData = this.generateFromRawData.bind(this)
        this.writeToFilePromise = this.writeToFilePromise.bind(this)
    }

    /**
     * Generate excel file from 2-dimension array with string values
     * @param rawData String[][]
     * @returns {Promise<*>}
     */
    async generateFromRawData(rawData) {
        //todo to stream

        /* create a new blank workbook */
        const wb = XLSX.utils.book_new();
        const new_ws_name = "SheetJS"

        const ws_data = [
            ["S", "h", "e", "e", "t", "J", "S"],
            [1, 2, 3, 4, 5]
        ]

        const ws = XLSX.utils.aoa_to_sheet(ws_data)

        XLSX.utils.book_append_sheet(wb, ws, new_ws_name)

        return wb
    }


    async writeToFilePromise(wb, path) {
        //todo to stream
        return new Promise((resolve, reject) => {
            XLSX.writeFileAsync(path, wb, (err, file) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(file)
                }
            })

        })
    }


}

module.exports = ExcelService

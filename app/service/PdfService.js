const puppeteer = require("puppeteer")
const logger = require("my-custom-logger")

class PdfService {


    constructor() {
        this.generateFromRawData = this.generateFromRawData.bind(this)
    }

    /**
     * Generate excel file from 2-dimension array with string values
     * @param rawData String[][]
     * @returns {Promise<*>}
     */
    async generateFromRawData(data, id) {
        //todo to stream
        logger.info("11")
        const browser = await puppeteer.launch()
        logger.info("12")
        const page = await browser.newPage()
        logger.info("13")
        await page.goto(`${process.env.FRONTEND_URL}/assets/uploads/order.html?summa=${data.amount}&inn=${data.inn}&companyName=${data.companyName}`, {waitUntil: "networkidle2"})
        logger.info("14")
        const file = await page.pdf({
            path: "/tmp/order-"+id+".pdf",
            format: "letter",
            margin: {
                top: 10,
                right: 35,
                bottom: 10,
                left: 80
            }
        })
        logger.info("15")
        await browser.close()
        logger.info("16")
        return file

    }




}

module.exports = PdfService

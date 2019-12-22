const puppeteer = require("puppeteer")

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

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`${process.env.FRONTEND_URL}/assets/uploads/order.html?summa=${data.amount}&inn=${data.inn}&companyName=${data.companyName}`, {waitUntil: "networkidle2"});

        const file = await page.pdf({
            path: "/tmp/order-"+id+".pdf",
            format: "letter",
            margin: {
                top: 10,
                right: 35,
                bottom: 10,
                left: 80
            }
        });
        await browser.close()

        return file

    }




}

module.exports = PdfService

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
        const browser = await puppeteer.launch({args: ["--no-sandbox", "--disable-setuid-sandbox"], ignoreHTTPSErrors: true})
        const page = await browser.newPage()
        await page.goto(`${process.env.FRONTEND_URL}/assets/uploads/order.html?summa=${data.amount}.00&inn=${data.inn}&companyName=${data.companyName}&orderNumber=${data.orderNumber}&services=${data.services}&prefix=${data.prefix}`, {waitUntil: "networkidle2"})
        await page.pdf({
            path: "/tmp/order-"+id+".pdf",
            format: "letter",
            margin: {
                top: 10,
                right: 35,
                bottom: 10,
                left: 80
            }
        })
        await browser.close()
        return data

    }
    /**
     * Generate excel file from 2-dimension array with string values
     * @param rawData String[][]
     * @returns {Promise<*>}
     */

    async generateSwiftFromRawData(data, id) {
        //todo to stream
        const browser = await puppeteer.launch({args: ["--no-sandbox", "--disable-setuid-sandbox"], ignoreHTTPSErrors: true})
        const page = await browser.newPage()
        await page.goto(`${process.env.FRONTEND_URL}/assets/uploads/orderSwift.html?summa=${data.amount}.00&inn=${data.inn}&companyName=${data.companyName}&orderNumber=${data.orderNumber}&services=${data.services}&prefix=${data.prefix}`, {waitUntil: "networkidle2"})
        await page.pdf({
            path: "/tmp/order-"+id+".pdf",
            format: "letter",
            margin: {
                top: 10,
                right: 35,
                bottom: 10,
                left: 80
            }
        })
        await browser.close()
        return data

    }
    /**
     * Generate excel file from 2-dimension array with string values
     * @param rawData String[][]
     * @returns {Promise<*>}
     */

    async generateActFromRawData(data, id) {
        //todo to stream
        const browser = await puppeteer.launch({args: ["--no-sandbox", "--disable-setuid-sandbox"], ignoreHTTPSErrors: true})
        const page = await browser.newPage()
        await page.goto(`${process.env.FRONTEND_URL}/assets/uploads/act.html?summa=${data.amount}.00&inn=${data.inn}&companyName=${data.companyName}&orderNumber=${data.orderNumber}&services=${data.services}&prefix=${data.prefix}`, {waitUntil: "networkidle2"})
        await page.pdf({
            path: "/tmp/act-"+id+".pdf",
            format: "letter",
            margin: {
                top: 10,
                right: 35,
                bottom: 10,
                left: 80
            }
        })
        await browser.close()
        return data

    }
    /**
     * Generate excel file from 2-dimension array with string values
     * @param rawData String[][]
     * @returns {Promise<*>}
     */

    async generatePartnerActFromRawData(data, id) {
        //todo to stream
        const browser = await puppeteer.launch({args: ["--no-sandbox", "--disable-setuid-sandbox"], ignoreHTTPSErrors: true})
        const page = await browser.newPage()
        const url = `${process.env.FRONTEND_URL}/assets/uploads/partnerAct.html?amount=${data.amount}.00&inn=${data.inn}&companyName=${data.companyName}&id=${data.id}&services=${data.services}&from=${data.from}&to=${data.to}&userId=${data.userId}`
        await page.goto(url, {waitUntil: "networkidle2"})
        await page.pdf({
            path: "/tmp/act-"+id+".pdf",
            format: "letter",
            margin: {
                top: 10,
                right: 35,
                bottom: 10,
                left: 80
            }
        })
        await browser.close()
        return data

    }




}

module.exports = PdfService

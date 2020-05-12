let puppeteer = require("puppeteer");
let fs = require("fs");
var nodemailer = require('nodemailer');


(async function () {
    try {
    
       await dataScraperNToJson();
       await jsonToPdf();
       await waitForDownload();
       await pdfMailer();
       

    }
    catch (err) {
        console.log(err);
    }
})();

async function dataScraperNToJson() {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--incognito", "--start-maximized"]
    });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto("https://www.covid19india.org/", { waitUntil: "networkidle0" });

    let state = await page.$$eval('table tbody tr td div span[class ="title-icon"]', e => e.map((a) => a.textContent));
    let total = await page.$$eval('table tbody tr td span[class ="total"]', e => e.map((a) => a.textContent));

    let num = 0;
    

    var data = {}
    table = [{}]
    for (idx = 0; idx < state.length - 1; idx++) {
        var obj = {
            state: state[idx],
            Confirmed: total[num + 0],
            Active: total[num + 1],
            Recovered: total[num + 2],
            Dead: total[num + 3]

        }
        table.push(obj)
        num += 4;
    }
    fs.writeFile("data.json", JSON.stringify(table), function (err) {
        if (err) throw err;
    }
    );
    console.log("Data Scrapped and saved to data.json file");
    page.close();

}
async function jsonToPdf() {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--incognito", "--start-maximized"]
      });

    let pages = await browser.pages();
    let page = pages[0];
    await page.goto("https://del.dog/sampleproject.txt", { waitUntil: "networkidle0" });
    await page.click("#box")
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.press('KeyC');
    await page.keyboard.up('Control');
    await page.goto("http://exporter.azurewebsites.net/Home/ExportData", { waitUntil: "networkidle0" });
    await page.click("#json");
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyV');
    // await page.type("#json",finalData)
    // await page.type("#", user);
    await page.click("body > div.container.body-content > div.row > div:nth-child(3) > p > a:nth-child(3)");
    let finTime = Date.now()+20000;
    while(Date.now()<finTime){
        continue;
    }
    console.log("JSON file converted to PDF file")
    page.close();

}
async function pdfMailer() {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'randomemailidforprojects@gmail.com',
            pass: 'myNewPassword'
        }
    });

    var mailOptions = {
        from: 'randomemailidforprojects@gmail.com',
        to: 'saiyam619@gmail.com',
        subject: 'Sending Email using Node.js',
        text: `This project is made by Saiyam 
                Please do share some ideas and contribute in my project`,
        attachments: [{
            file: "andrei.pdf",
            path: "D:\\Downloads\\andrei.pdf"
        }
        ]

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent');
            console.log('All Task Over');
        }
    });
}
async function waitForDownload(){
    let cTime = Date.now()
    let fTime = cTime+25000;
    while(cTime<fTime){
        cTime = Date.now();
    }
    console.log("Wait for download Over");
}


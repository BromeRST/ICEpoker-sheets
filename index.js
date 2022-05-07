const {ethers} = require("ethers");
const {google} = require("googleapis");
const fetch = require("cross-fetch");

const nodeCron = require("node-cron");
const moment = require("moment");

const POLYGON_KEY =
  "https://polygon-mainnet.g.alchemy.com/v2/QdzN_7dicLMlXL4E3Nhfzwh1x95abRMs";

const ERC20_ADDRESS = "0xc6C855AD634dCDAd23e64DA71Ba85b8C51E5aD7c";

const abi = ["event Transfer(address indexed src, address indexed dst, uint val)"];

const alchemyProvider = new ethers.providers.JsonRpcProvider(POLYGON_KEY);

const contract = new ethers.Contract(ERC20_ADDRESS, abi, alchemyProvider);

const guildAddr = "0x9C415DC99eb8fF4Fe2FDa81cf7DCcD15820dD5cA";

let lastTimestamp;
let firstTimestamp;

let lastBlock /* = 28010646 */
let firstBlock /* = 27971658 */

let today;
let dd;

// function to find block based on timestamp
const findBlockFromTimestamp = async (timestamp) => {
    const response = await fetch(
      `https://api.polygonscan.com/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=YourApiKeyToken`
    );
    const blockNumber = await response.json();
    console.log(Number(blockNumber.result))
    return Number(blockNumber.result);
}

async function getLastBlockFromTs () {
    lastBlock = await findBlockFromTimestamp(lastTimestamp);
}

async function getFirstBlockFromTs () {
    firstBlock = await findBlockFromTimestamp(firstTimestamp);
}

// function to fetch daily ERC20 earn
const fetchERC20BorrowerEntry = async (borrower) => {
    try {
        if (borrower !== undefined) {
            const filter = contract.filters.Transfer("0x1AE5397942Bf43CE1Fe3f137622A0a7a33Ac4826", borrower);
            const events = await contract.queryFilter(filter, firstBlock, lastBlock);
            let totalDailyEarn = 0;

            events.map((e) =>
                totalDailyEarn += Number(ethers.utils.formatUnits(e.args.val))
            );

            return totalDailyEarn.toFixed(0);
        }
        return 0;
    } catch (err) {
        console.error(err);
    }
};

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
}); 

const spreadsheetId = "1cBEa3VpobbgZoSqudctCPGTjsu7e84cqeB-l9SV5MIc";

async function main (borrower, i, column) {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {

      // Write row(s) to spreadsheet
        sheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: `Results May 22!${column}${i}`, //`Foglio1!A${i}:B${i}`,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [`${await fetchERC20BorrowerEntry(borrower)}`]
                ]
            }    
        })

    } catch (err) {
      console.error(err);
    }
}


async function fetchDataFromSheet () {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {
        // Read rows from spreadsheet
        const getRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Results May 22!B1:B20",
        })

        return getRows.data.values
    } catch (err) {
        console.error(err);
    }
}


async function loop (column) {
    lastTimestamp = moment().unix();
    firstTimestamp = moment().subtract(1, 'days').unix();
    
    const borrowerArray = await fetchDataFromSheet();
    getLastBlockFromTs();
    setTimeout(getFirstBlockFromTs, 8000)

    setTimeout(() => {
        console.log(borrowerArray)
        for (let i = 1; i < borrowerArray.length; i++) {
            main(borrowerArray[i][0], i+1, column);
        }
    }, 10000)
}

async function fetchDataFromSheet2 () {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {
        // Read rows from spreadsheet
        const getRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Results May 22!B21:B41",
        })

        return getRows.data.values
    } catch (err) {
        console.error(err);
    }
}

async function loop2 (column) {
    const borrowerArray = await fetchDataFromSheet2();
    console.log(borrowerArray)
    for (let i = 0; i < borrowerArray.length; i++) {
        main(borrowerArray[i][0], i+21, column)
    }
}

async function fetchDataFromSheet3 () {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {
        // Read rows from spreadsheet
        const getRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Results May 22!B42:B65",
        })

        return getRows.data.values
    } catch (err) {
        console.error(err);
    }
}

async function loop3 (column) {
    const borrowerArray = await fetchDataFromSheet3();
    console.log(borrowerArray)
    for (let i = 0; i < borrowerArray.length; i++) {
        main(borrowerArray[i][0], i+42, column)
    }
}

async function fetchDataFromSheet4 () {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {
        // Read rows from spreadsheet
        const getRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Results May 22!B66:B90",
        })

        return getRows.data.values
    } catch (err) {
        console.error(err);
    }
}

async function loop4 (column) {
    const borrowerArray = await fetchDataFromSheet4();
    console.log(borrowerArray)
    for (let i = 0 ; i < borrowerArray.length; i++) {
        main(borrowerArray[i][0], i+66, column)
    }
}

async function fetchDataFromSheet5 () {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {
        // Read rows from spreadsheet
        const getRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Results May 22!B91:B120",
        })

        return getRows.data.values
    } catch (err) {
        console.error(err);
    }
}

async function loop5 (column) {
    const borrowerArray = await fetchDataFromSheet5();
    console.log(borrowerArray)
    if (borrowerArray !== undefined) {
        for (let i = 0 ; i < borrowerArray.length; i++) {
            main(borrowerArray[i][0], i+91, column)
        }
    }
}

async function fetchDataFromSheet6 () {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {
        // Read rows from spreadsheet
        const getRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Results May 22!B121:B",
        })

        return getRows.data.values
    } catch (err) {
        console.error(err);
    }
}

async function loop6 (column) {
    const borrowerArray = await fetchDataFromSheet6();
    console.log(borrowerArray)
    if (borrowerArray !== undefined) {
        for (let i = 0 ; i < borrowerArray.length; i++) {
            main(borrowerArray[i][0], i+121, column)
        }
    }
}

const sheetsColumnsArray = ["E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK"];


let i;

function updateDate() {
    today = new Date(); 
    dd = String(today.getDate()).padStart(2, '0');
    if (Number(dd) === 1) {
        i = 30
    } else {
        i = Number(dd - 1);
    }
}

const job = nodeCron.schedule("0 02 00 * * *", function jobYouNeedToExecute() {
    updateDate();
    console.log("i", i);

    if ( i <= 31) {
        loop(sheetsColumnsArray[i]);
    }

}, {timezone: "Etc/GMT"});

const job2 = nodeCron.schedule("0 04 00 * * *", function jobYouNeedToExecute() {
    console.log(i);

    if ( i <= 31) {
        loop2(sheetsColumnsArray[i]);
    }

}, {timezone: "Etc/GMT"});

const job3 = nodeCron.schedule("0 06 00 * * *", function jobYouNeedToExecute() {
    console.log(i);

    if ( i <= 31) {
        loop3(sheetsColumnsArray[i]);
    }

}, {timezone: "Etc/GMT"});

const job4 = nodeCron.schedule("0 08 00 * * *", function jobYouNeedToExecute() {
    console.log(i);

    if ( i <= 31) {
        loop4(sheetsColumnsArray[i]);
    }

}, {timezone: "Etc/GMT"});

const job5 = nodeCron.schedule("0 10 00 * * *", function jobYouNeedToExecute() {
    console.log(i);

    if ( i <= 31) {
        loop5(sheetsColumnsArray[i]);
    }

}, {timezone: "Etc/GMT"});

const job6 = nodeCron.schedule("0 12 00 * * *", function jobYouNeedToExecute() {
    console.log(i);

    if ( i <= 31) {
        loop6(sheetsColumnsArray[i]);
    }

}, {timezone: "Etc/GMT"});

const job7 = nodeCron.schedule("0 14 00 * * *", function jobYouNeedToExecute() {
    console.log(i);

    if ( i <= 31) {
        fetchDataFromSheetTotal()
    }

}, {timezone: "Etc/GMT"});

// function to find block number from timestamp
/* const findBlock = async () => {
    const response = await fetch(
      `https://api.polygonscan.com/api?module=block&action=getblocknobytime&timestamp=1651881720&closest=before&apikey=YourApiKeyToken`
    );
    const blockNumber = await response.json();
    console.log("BLOCK", Number(blockNumber.result))
}

findBlock(); */

// function to find addresses and daily gain for address from sheet
async function fetchDataFromSheetTotal () {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {
        // Read rows from spreadsheet
        const getRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Results May 22!B:B",
        })

        const getDailyEarn = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `Results May 22!${sheetsColumnsArray[i]}:${sheetsColumnsArray[i]}`,
        })

        const length = getRows.data.values.length;

        for (let i = 1; i < length; i ++) {
            fetchERC20BorrowerSend20(getRows.data.values[i][0], getDailyEarn.data.values[i][0], i)
        }

    } catch (err) {
        console.error(err);
    }
}

// function to fetch daily ERC20 send to guild 20%
const fetchERC20BorrowerSend20 = async (borrower, dailyEarn, startRowIndex) => {
    try {
        if (borrower !== undefined) {
            const filter = contract.filters.Transfer(borrower, guildAddr );
            const events = await contract.queryFilter(filter, firstBlock, lastBlock);
            let totalSent = 0;

            events.map((e) =>
                totalSent += Number(ethers.utils.formatUnits(e.args.val))
            );

            //console.log("borrower", borrower, "sent", Number(totalSent.toFixed(0)), "dE", Number(dailyEarn));
            if (Number(totalSent.toFixed(0)) > Number(dailyEarn) * 0.18 && Number(totalSent.toFixed(0)) < Number(dailyEarn) * 0.22) {
                //console.log("true")
                colorGreen(startRowIndex)
            } /* else {
                console.log("false");
            } */
        } /* else {
            console.log("no address")
        } */
    } catch (err) {
        console.error(err);
    }
};

// function to verify that player sent the right ammount to guild
async function colorGreen (startRowIndex) {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {

        const sheetId = 5933059; // TO CHANGE EVERY MONTH

      // Write row(s) to spreadsheet
        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
                requests : {
                    updateCells: {
                        range: {
                            sheetId: sheetId,
                            startRowIndex: startRowIndex,
                            endRowIndex: startRowIndex + 1,
                            startColumnIndex: i + 4 ,
                            endColumnIndex: i + 5 ,
                        },
                        rows: [{
                            values: [{
                                userEnteredFormat: {
                                    backgroundColor: {
                                        green: 1.0
                                    }
                                }
                            }]
                        }],
                    fields: "userEnteredFormat.backgroundColor",
                    }
                }
            }
        })

    } catch (err) {
      console.error(err);
    }
}

/* let date2 = new Date("2022-04-12T00:02:00Z");
let timestamp = date2.getTime()
console.log(timestamp / 1000)

let dates = ["2022-04-06T00:02:00Z" ,"2022-04-07T00:02:00Z", "2022-04-08T00:02:00Z" ,"2022-04-09T00:02:00Z", "2022-04-10T00:02:00Z", "2022-04-11T00:02:00Z", "2022-04-12T00:02:00Z"] */
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

let lastTimestamp;
let firstTimestamp;

let lastBlock;
let firstBlock;

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

// function to fetch daily FUD earn
const fetchERC20BorrowerEntry = async (borrower) => {
    try {
        if (borrower !== undefined) {
            const filter = contract.filters.Transfer(null, borrower);
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
            range: `Results April 22!${column}${i}`, //`Foglio1!A${i}:B${i}`,
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
            range: "Results April 22!B1:B20",
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
    setTimeout(getFirstBlockFromTs, 5000)

    setTimeout(() => {
        console.log(borrowerArray)
        for (let i = 1; i < borrowerArray.length; i++) {
            main(borrowerArray[i][0], i+1, column);
        }
    }, 7000)
}

async function fetchDataFromSheet2 () {
    const client = await auth.getClient();
    const sheets = google.sheets({version: 'v4', auth: client});

    try {
        // Read rows from spreadsheet
        const getRows = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Results April 22!B21:B41",
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
            range: "Results April 22!B42:B65",
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
            range: "Results April 22!B66:B89",
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


const sheetsColumnsArray = ["E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK"];

let i = 8;
let j = 8;
let k = 8;
let m = 8;

const job = nodeCron.schedule("0 00 00 * * *", function jobYouNeedToExecute() {
    console.log(i);

    if ( i <= 31) {
        loop(sheetsColumnsArray[i]);
        i ++;
    }

}, {timezone: "Etc/GMT"});

const job2 = nodeCron.schedule("0 02 00 * * *", function jobYouNeedToExecute() {
    console.log(j);

    if ( j <= 31) {
        loop2(sheetsColumnsArray[j]);
        j ++;
    }

}, {timezone: "Etc/GMT"});

const job3 = nodeCron.schedule("0 04 00 * * *", function jobYouNeedToExecute() {
    console.log(k);

    if ( k <= 31) {
        loop3(sheetsColumnsArray[k]);
        k ++;
    }

}, {timezone: "Etc/GMT"});

const job4 = nodeCron.schedule("0 06 00 * * *", function jobYouNeedToExecute() {
    console.log(m);

    if ( m <= 31) {
        loop4(sheetsColumnsArray[m]);
        m ++;
    }

}, {timezone: "Etc/GMT"});
const express = require('express');
const app = express();

const gameGroups = [{
    gameGroupID: 14,
    gameGroupNameAlias: 'Game Group 1'
  },
  {
    gameGroupID: 15,
    gameGroupNameAlias: 'Game Group 2'
  }
];

const gameTypes = [{
  gameTypeID: 248,
  gameTypeNo: 'R0034',
  gameTypeNameAlias: 'Game Type 1'
}, {
  gameTypeID: 249,
  gameTypeNo: 'R0035',
  gameTypeNameAlias: 'Game Type 2'
}];

const jackpotTypes = [{
  jackpotType: 1,
  jackpotTypeName: {
    eN: 'MegaWin_Lv1_RM_EN'
  },
  gameTypeID: 248,
  gameGroupID: 14
}, {
  jackpotType: 2,
  jackpotTypeName: {
    eN: 'MegaWin_Lv2_RM_EN'
  },
  gameTypeID: 249,
  gameGroupID: 14
}];

const realTimeReport = [{
  "gameTypeNameAlias": "Baccarat (Progressive JP)",
  "jackpotTypeAlias": "MegaWin_Lv1_UUS_EN",
  "gameGroupNameAlias": "Card Games",
  "jackpotStartDate": "10-12-2017 15:31:00.000",
  "playerCount": 2145,
  "betCount": 274650,
  "totalBet": 1198875,
  "currentRefundPool": 0,
  "currentReservePool": 30000,
  "currentJackpotPool": 65910,
  "pJMainID": 1,
  "level": "1"
}];

const winnerReport = [{
    "gameTypeNameAlias": "Baccarat (Progressive JP)",
    "jackpotTypeAlias": "MegaWin_Lv1_UUS_EN",
    "gameGroupNameAlias": "Card Games",
    "jackpotStartDate": "10-12-2017 15:31:00.000",
    "jackpotHitDate": "31-12-2017 15:31:00.000",
    "userName": "SAS0101001",
    "winningAmt": 10000.68
  },
  {
    "gameTypeNameAlias": "Baccarat (Progressive JP)",
    "jackpotTypeAlias": "MegaWin_Lv2_UUS_EN",
    "gameGroupNameAlias": "Card Games",
    "jackpotStartDate": "31-12-2017 15:31:00.000",
    "jackpotHitDate": "05-1042-2018 15:31:00.000",
    "userName": "ACGUUS3838001",
    "winningAmt": 200000
  }
];

const monthlyReport = [{
  "gameTypeNameAlias": "Baccarat (Progressive JP)",
  "jackpotTypeAlias": "MegaWin_Lv1_UUS_EN",
  "gameGroupNameAlias": "Card Games",
  "month": "12-2017",
  "playerCount": 2145,
  "betCount": 274650,
  "totalBet": 1198875
}];

const dailyReport = [{
  "gameTypeNameAlias": "Baccarat (Progressive JP)",
  "jackpotTypeAlias": "MegaWin_Lv1_UUS_EN",
  "gameGroupNameAlias": "Card Games",
  "date": "10-12-2017",
  "playerCount": 2145,
  "betCount": 274650,
  "totalBet": 1198875
}];

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/api/progressive-jackpot/game-group', (req, res) => res.send(gameGroups));
app.post('/api/progressive-jackpot/game-type', (req, res) => res.send(gameTypes));
app.post('/api/progressive-jackpot/jackpot-type', (req, res) => res.send(jackpotTypes));
app.post('/api/progressive-jackpot/real-time', (req, res) => res.send(realTimeReport));
app.post('/api/progressive-jackpot/winner', (req, res) => res.send(winnerReport));
app.post('/api/progressive-jackpot/monthly', (req, res) => res.send(monthlyReport));
app.post('/api/progressive-jackpot/daily', (req, res) => res.send(dailyReport));
app.listen(3000, () => console.log('Example app listening on port 3000!'));

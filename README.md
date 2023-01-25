# arbitrage-price-scanner

Price scanner written in NodeJs for scanning for arbitrage opportunities

## Installation

```bash
npm install
```

## Usage
```bash
npm run start
```

## Notes

### Current Functionality:
- Grabs a top 100 ticker list off coingecko that is used to scan for trading opportunities
- Scans blindly for profitable trading opportunities between Pancakeswap and Biswap.

### To Add:
- Add functionality to actually execute a deployed smart contract when an opportunity is found to fit the criteria of being profitable.
- Instead of blindly scanning, compare the prices of a pair on each exchange for the cheapest first before testing the swap. This will significantly reduce the amount of dud trades we are checking.
- Add a triangle arbitrage function (e.g BNB/CAKE -> CAKE/BUSD -> BUSD/BNB).
- Add in additional exchanges in.
- Add support for other chains.
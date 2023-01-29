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
- Add in additional exchanges in.
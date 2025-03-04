const sdk = require("@defillama/sdk")
const abi = require('./abi.json');
const { sumTokens2, nullAddress } = require('../helper/unwrapLPs')

const aztecRollupProcessor = '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba'
const aztecConnect = '0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455'

async function tvl(_, block) { 
    // Get aztec supported assets
    const { output: supportedAssets } = await sdk.api.abi.call({ target: aztecRollupProcessor, abi: abi['getSupportedAssets'], block, })
    const tokensAndOwners = ([nullAddress, ...supportedAssets]).map(i => ([i, aztecRollupProcessor]))
    const supportedAssetsConnect = await sdk.api2.abi.fetchList({ target: aztecConnect, lengthAbi: abi.getSupportedAssetsLength, itemAbi: abi.getSupportedAsset, block, })
    tokensAndOwners.push([nullAddress, aztecConnect])
    supportedAssetsConnect.map(i => tokensAndOwners.push([i, aztecConnect]))
    return sumTokens2({ tokensAndOwners, block, })
}

module.exports = {
  methodology: "TVL of Aztec consists of ethereum and supported assets (DAI and renBTC at the moment) locked into the rollup processor",
  ethereum: {
    tvl,
  }
}

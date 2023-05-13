require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/d58c8a1d78d24cf0b7de4ffb36ce75e0",
      accounts: ["2903a53cc547886569042ab01fbc46988a82681a635871b7962d21b043c22bc9"]
    },
    sepolia: {
        url: "https://sepolia.infura.io/v3/d0962878930443e4b74fec2c1ac3c8d0",
        accounts: ["a483826247e370132fa634ee0b060daf3f1c8fab4f906252fe6770ae4305f349"]
    },
    hardhat:{
        chainId: 1337,
    }
  },
  paths: {
    artifacts: "../client/src/abis"
  }
}
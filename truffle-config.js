module.exports = {
  networks: {
    development: {
      host: "https://rock-paper-scissors-nine-orcin.vercel.app",
      
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
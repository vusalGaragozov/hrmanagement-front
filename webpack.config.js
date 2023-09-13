module.exports = {
    // ... other webpack configuration ...
  
    resolve: {
      fallback: {
        util: require.resolve('util/')
      }
    }
  };
  
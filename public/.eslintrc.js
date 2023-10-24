module.exports = {
    // ... other ESLint configurations

    globals: {
        google: 'writable',
    },

    settings: {
        react: {
            version: 'detect', // This is necessary if you're using React
        },
    },
};

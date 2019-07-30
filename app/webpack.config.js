module.exports = {
    entry: "./splitter.js",
    output: {
        path: __dirname + "/build/app/",
        filename: "splitter.js"
    },
    module: {
        rules: []
    }
};
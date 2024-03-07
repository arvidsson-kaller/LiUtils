const timeedit = require("./timeedit");

module.exports = {
    hello: () => {
        console.log("hello world")
    },
    ...timeedit
}
function PrintValueAndExit(value, threshold) {
    console.log(value);

    if (threshold)
        console.error(value > threshold ? "1" : 0);

    process.exit(0);
}

function ErrorHandler(err) {
    console.error("Script error");
    console.error(err);

    process.exit(255);
}

module.exports.PrintValueAndExit = PrintValueAndExit;
module.exports.ErrorHandler = ErrorHandler;
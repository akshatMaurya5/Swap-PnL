const fs = require('fs');
const readline = require('readline');

// Input and output file paths
const inputFilePath = 'rawdata.json';
const outputFilePath = 'input.json';

// Read the JSONL file line by line and convert it to JSON
const jsonObjects = [];
const readStream = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
    output: process.stdout,
    terminal: false
});

readStream.on('line', (line) => {
    try {
        const jsonObject = JSON.parse(line);
        jsonObjects.push(jsonObject);
    } catch (error) {
        console.error(`Error parsing line: ${line}`);
        console.error(error);
    }
});

readStream.on('close', () => {
    // Write the parsed JSON objects to a new JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonObjects, null, 2));
    console.log(`Conversion completed. Output written to ${outputFilePath}`);
});

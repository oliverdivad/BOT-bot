const fs = require('fs');
const path = require('path');

const allocationsFilePath = path.resolve(__dirname, 'allocations.json');

exports.handler = async function(event, context) {
    try {
        const data = fs.readFileSync(allocationsFilePath, 'utf8');
        const allocations = JSON.parse(data);
        return {
            statusCode: 200,
            body: JSON.stringify(allocations)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to read allocations' })
        };
    }
};

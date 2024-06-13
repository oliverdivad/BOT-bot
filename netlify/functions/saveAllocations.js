const fs = require('fs');
const path = require('path');

const allocationsFilePath = path.resolve(__dirname, 'allocations.json');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    try {
        const newAllocation = JSON.parse(event.body);
        const data = fs.readFileSync(allocationsFilePath, 'utf8');
        const allocations = JSON.parse(data);
        allocations.push(newAllocation);
        fs.writeFileSync(allocationsFilePath, JSON.stringify(allocations, null, 2));
        return {
            statusCode: 200,
            body: JSON.stringify(newAllocation)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save allocation' })
        };
    }
};

require('dotenv').config();
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

const params = {
    TableName: process.env.AWS_TABLE_NAME,
    Key: {
        'student_id': { S: '6430204221' }
    }
};

const command = new GetItemCommand(params);

client.send(command, (err, data) => {
    if (err) {
        console.error(err);
    } else {
        console.log(JSON.stringify(data.Item));
    }
});

// exports.getItems = async (req, res) => {
//     try {
//         const params = {
//             TableName: 'ess_final_group_18'
//         };

//         const command = new ScanCommand(params);

//         const { Items } = await client.send(command);

//         res.json(Items);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// };

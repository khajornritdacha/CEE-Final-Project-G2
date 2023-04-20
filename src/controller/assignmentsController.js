const dotenv = require('dotenv');
dotenv.config();
const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

// 1. get assignments from db
// 2. get assignments from mcv
// 3. compare, if not in db, add to db
// 4. return assignments from db

const writeAssignments = async (updateItemRequest) => {
  const params = {
    RequestItems: {
      [process.env.aws_assignments_table_name]: updateItemRequest,
    },
  };

  try {
    const data = await docClient.send(new BatchWriteItemCommand(params));
    console.log('Success, items inserted', data);
    return data;
  } catch (err) {
    console.log('Error', err);
    return null;
  }
};

exports.readAssignmentsMcv = async (req, _res) => {
  try {
    const data = await fetch(
      'https://www.mycourseville.com/api/v1/public/get/user/courses',
      {
        headers: {
          Authorization: `Bearer ${'SugUwd5Npz44aYZs95TtsIimMyb2dEBr5nELRKmZ'}`,
        },
      }
    );
    console.log(data);
  } catch (err) {
    console.log(err);
  }
  _res.sendStatus(200);
  //   return [];
};

const readAssignmentsDb = async () => {
  const params = {
    TableName: process.env.aws_assignments_table_name,
  };
  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    return Items;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const syncAssignments = async () => {
  const dbItems = readAssignmentsDb();
  const mcvItems = [];
  const updateItemRequest = [];
  for (const item of dbItems) {
    if (!mcvItems.includes(item.item_id)) {
      updateItemRequest.push({
        PutRequest: {
          Item: {
            item_id: { S: item.item_id },
            student_id: { S: '6532155621' },
            isFinished: { BOOL: false },
          },
        },
      });
    }
  }
  await writeAssignments(updateItemRequest);
};

exports.addAssignment = async (req, res) => {
  const item = {
    ...req.body,
  };

  const putParams = {
    Item: item,
    TableName: process.env.aws_assignments_table_name,
  };
  try {
    const response = await docClient.send(new PutCommand(putParams));
    console.log(response);
    res.send('Add item successfully');
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

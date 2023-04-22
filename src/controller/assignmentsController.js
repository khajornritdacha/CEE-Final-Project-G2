// TODO: add refresh token
// TODO: optimize the number of reading db

const dotenv = require('dotenv');
dotenv.config();
const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { default: axios } = require('axios');

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

const writeAssignments = async (updateItemRequest) => {
  if (updateItemRequest <= 0) return;

  try {
    let promises = [];
    let updateReq = [];
    for (let i = 0; i < updateItemRequest.length; i++) {
      updateReq.push(updateItemRequest[i]);
      // BatchWriteItem can only write 25 items at a time
      if (updateReq.length === 25 || i === updateItemRequest.length - 1) {
        const params = {
          RequestItems: {
            [process.env.aws_assignments_table_name]: updateReq,
          },
        };
        promises.push(docClient.send(new BatchWriteItemCommand(params)));
        updateReq = [];
      }
    }
    const data = await Promise.all(promises);
    return data;
  } catch (err) {
    console.log('Error', err);
    return null;
  }
};

const fetchCourses = async (access_token, options) => {
  const { year, semester, course_no } = options;
  try {
    const url = new URL(
      'https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1'
    );
    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const courses = data.data.data.student.map((course) => ({
      ...course,
      year: String(course.year),
      semester: String(course.semester),
      cv_cid: String(course.cv_cid),
    }));
    if (!year || !semester)
      throw new Error('Year or semester is not provided.');
    const filteredCourses = courses.filter(
      (item) =>
        String(item.year) === String(year) &&
        String(item.semester) === String(semester) &&
        (!course_no || item.course_no === course_no)
    );
    return filteredCourses;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getCoursesAssignments = async (access_token, courses) => {
  const promises = [];
  try {
    for (const course of courses) {
      const url = new URL(
        'https://www.mycourseville.com/api/v1/public/get/course/assignments'
      );
      url.searchParams.append('cv_cid', course.cv_cid);
      url.searchParams.append('detail', '1');
      promises.push(
        axios.get(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          transformResponse: [
            (data) => {
              const assignments = JSON.parse(data).data;
              return assignments.map((item) => ({
                ...item,
                course,
              }));
            },
          ],
        })
      );
    }
    const data = await Promise.all(promises);
    return data.reduce((acc, item) => {
      return acc.concat(item.data);
    }, []);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const readAssignmentsDb = async (options, session) => {
  console.log(session.profile);
  console.log(session.profile.student);
  console.log(session.profile.student.id);
  const params = {
    TableName: process.env.aws_assignments_table_name,
  };
  try {
    let { Items } = await docClient.send(new ScanCommand(params));
    if (!!options && options?.year && options?.semester) {
      Items = Items.filter(
        (item) =>
          item.course.year == options.year &&
          item.course.semester == options.semester
      );
    }
    if (!!options && !!options?.course_no) {
      Items = Items.filter(
        (item) => item.course.course_no === options.course_no
      );
    }
    Items = Items.filter(
      (item) => item.student_id === session.profile.student.id
    );
    return Items;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 *
 * @param {*} session
 * @return {Promise<boolean>}
 */
const canSkipSync = (session) => {
  const currentTime = Date.now() / 1000;
  console.log('Check can skip sync');
  if (
    session?.profile?.lastSyncTime &&
    currentTime - session.profile.lastSyncTime < 60 * 15
  ) {
    console.log('Can skip sync');
    return true;
  }
  return false;
};

const syncAllCoursesAssignments = async (access_token, options, session) => {
  try {
    if (canSkipSync()) return;
    const dbItems = await readAssignmentsDb(options);
    const dbItemsId = dbItems.map((item) => item.item_id);
    const courses = await fetchCourses(access_token, options);
    const mcvItems = await getCoursesAssignments(access_token, courses);
    const updateItemRequest = [];
    for (const item of mcvItems) {
      if (!dbItemsId.includes(item.itemid)) {
        updateItemRequest.push({
          PutRequest: {
            Item: {
              item_id: { S: String(item.itemid) },
              student_id: { S: session.profile.student.id },
              is_finished: { BOOL: false },
              title: { S: item.title },
              out_time: { S: String(item.changed) },
              due_time: { S: String(item.duetime) },
              course: {
                M: {
                  cv_cid: { S: String(item.course.cv_cid) },
                  course_no: { S: String(item.course.course_no) },
                  title: { S: item.course.title },
                  year: { S: String(item.course.year) },
                  semester: { S: String(item.course.semester) },
                  course_icon: { S: item.course.course_icon },
                },
              },
            },
          },
        });
      }
    }
    await writeAssignments(updateItemRequest);
    session.profile.lastSyncTime = Date.now() / 1000;
    console.log(`Synced ${updateItemRequest.length} assignments`);
  } catch (err) {
    console.log(err);
  }
};

const getRawAssignments = async (access_token, options, session) => {
  try {
    await syncAllCoursesAssignments(access_token, options, session);
    const data = await readAssignmentsDb(options, session);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// TODO: test this route
exports.getCourses = async (req, res) => {
  try {
    if (!req.session.token.access_token)
      res.status(400).json({ message: 'Token not found' });
    const data = await fetchCourses(req.session.token.access_token, req.query);
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

exports.getDoneAssignments = async (req, res) => {
  const { year, semester, course_no } = req.query;
  if (!year || !semester)
    return res
      .status(400)
      .json({ message: 'Year or semester is not provided.' });
  try {
    if (!req.session.token)
      return res.status(400).json({ message: 'Token not found' });
    if (!req.session.profile.student.id)
      return res.status(400).json({ message: 'Invalid Student Id' });
    const currentTime = Math.floor(Date.now() / 1000);
    const data = (
      await getRawAssignments(
        req.session.token.access_token,
        {
          year,
          semester,
          course_no,
        },
        req.session
      )
    ).filter((item) => {
      return item.is_finished && currentTime >= Number(item.due_time);
    });

    // Sort by most recent due time
    data.sort((a, b) => {
      return b.due_time - a.due_time;
    });

    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

exports.getMissedAssignments = async (req, res) => {
  const { year, semester, course_no } = req.query;
  if (!year || !semester)
    return res
      .status(400)
      .json({ message: 'Year or semester is not provided.' });
  try {
    if (!req.session.token)
      return res.status(400).json({ message: 'Token not found' });
    if (!req.session.profile.student.id)
      return res.status(400).json({ message: 'Invalid Student Id' });
    const currentTime = Math.floor(Date.now() / 1000);
    const data = (
      await getRawAssignments(
        req.session.token.access_token,
        {
          year,
          semester,
          course_no,
        },
        req.session
      )
    ).filter((item) => {
      return !item.is_finished && currentTime >= Number(item.due_time);
    });

    // Sort by most recent due time
    data.sort((a, b) => {
      return b.due_time - a.due_time;
    });

    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

exports.getAssignedAssignments = async (req, res) => {
  console.log('Current Session');
  console.log(req?.session);
  const { year, semester, course_no } = req.query;
  if (!year || !semester)
    return res
      .status(400)
      .json({ message: 'Year or semester is not provided.' });
  try {
    if (!req.session.token.access_token)
      return res.status(400).json({ message: 'Token not found' });
    if (!req.session.profile.student.id)
      return res.status(400).json({ message: 'Invalid Student Id' });

    const currentTime = Math.floor(Date.now() / 1000);
    const data = (
      await getRawAssignments(
        req.session.token.access_token,
        {
          year,
          semester,
          course_no,
        },
        req.session
      )
    ).filter((item) => {
      return !item.is_finished && currentTime < Number(item.due_time);
    });

    // Sort by earliest due time
    data.sort((a, b) => {
      return a.due_time - b.due_time;
    });

    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
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
    res.send('Add item successfully');
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

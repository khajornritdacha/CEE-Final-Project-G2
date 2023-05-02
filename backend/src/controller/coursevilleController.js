const dotenv = require('dotenv');
dotenv.config();
const https = require('https');
const url = require('url');
const querystring = require('querystring');
const axios = require('axios');

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = 'https://www.mycourseville.com/api/oauth/access_token';

exports.authApp = (req, res) => {
  res.redirect(authorization_url);
};

exports.accessToken = async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
      grant_type: 'authorization_code',
      code: parsedQuery.code,
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      redirect_uri: redirect_uri,
    });

    const tokenOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    };

    try {
      const tokenRes = await axios.post(
        access_token_url,
        postData,
        tokenOptions
      );
      const token = tokenRes.data;

      console.log(token);

      if (!token)
        return res.status(400).json({ message: 'Error in authenticating' });

      req.session.token = token;

      const profileRes = await axios.get(
        'https://www.mycourseville.com/api/v1/public/get/user/info',
        {
          headers: {
            Authorization: `Bearer ${req.session.token.access_token}`,
          },
        }
      );
      const profile = profileRes.data.data;

      console.log(profile);

      if (!profile)
        return res.status(400).json({ message: 'Error in authenticating' });

      req.session.profile = profile;
      req.session.token = {
        ...req.session.token,
        student_id: profile.student.id,
      };

      const { firstname_en, lastname_en, id } = req.session.profile.student;
      console.log(
        `student ${id}(${firstname_en} ${lastname_en}) has logged in.`
      );

      return res.redirect(302, `http://${process.env.frontendIPAddress}`);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  } else {
    res.writeHead(302, { Location: authorization_url });
    res.end();
  }
};

// Example: Send "GET" request to CV endpoint to get user profile information
exports.getProfileInformation = (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const profileReq = https.request(
      'https://www.mycourseville.com/api/v1/public/users/me',
      profileOptions,
      (profileRes) => {
        let profileData = '';
        profileRes.on('data', (chunk) => {
          profileData += chunk;
        });
        profileRes.on('end', () => {
          const profile = JSON.parse(profileData);
          res.send(profile);
          res.end();
        });
      }
    );
    profileReq.on('error', (err) => {
      console.error(err);
    });
    profileReq.end();
  } catch (error) {
    console.log(error);
    console.log('Please logout, then login again.');
  }
};

// DONE #3.2: Send "GET" request to CV endpoint to get all courses that you enrolled
exports.getCourses = (req, _res) => {
  // You should change the response below.
  const courseReq = https.request(
    'https://www.mycourseville.com/api/v1/public/get/user/courses',
    {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const profile = JSON.parse(data);
        _res.send(profile);
        _res.end();
      });
    }
  );
  courseReq.on('error', (err) => {
    console.error(err);
  });
  courseReq.end();
};

// DONE #3.4: Send "GET" request to CV endpoint to get all course assignments based on cv_cid
exports.getCourseAssignments = (req, _res) => {
  const cv_cid = req.params.cv_cid;
  const assessmentReq = https.request(
    'https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=' +
      cv_cid,
    {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const profile = JSON.parse(data);
        _res.send(profile);
        _res.end();
      });
    }
  );
  assessmentReq.on('error', (err) => {
    console.error(err);
  });
  assessmentReq.end();
};

// Outstanding #2
exports.getAssignmentDetail = (req, res) => {
  const itemid = req.params.item_id;
  // You should change the response below.
  res.send('This route should get assignment details based on item_id.');
  res.end();
};

exports.logout = async (req, res) => {
  req.session.destroy();
  res.end();
};
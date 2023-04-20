<<<<<<< HEAD
const dotenv = require("dotenv");
dotenv.config();
const https = require("https");
const url = require("url");
const querystring = require("querystring");

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";
=======
const dotenv = require('dotenv');
dotenv.config();
const https = require('https');
const url = require('url');
const querystring = require('querystring');

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = 'https://www.mycourseville.com/api/oauth/access_token';
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046

exports.authApp = (req, res) => {
  res.redirect(authorization_url);
};

exports.accessToken = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
<<<<<<< HEAD
    res.writeHead(400, { "Content-Type": "text/plain" });
=======
    res.writeHead(400, { 'Content-Type': 'text/plain' });
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
<<<<<<< HEAD
      grant_type: "authorization_code",
=======
      grant_type: 'authorization_code',
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
      code: parsedQuery.code,
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      redirect_uri: redirect_uri,
    });

    const tokenOptions = {
<<<<<<< HEAD
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
=======
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
      },
    };

    const tokenReq = https.request(
      access_token_url,
      tokenOptions,
      (tokenRes) => {
<<<<<<< HEAD
        let tokenData = "";
        tokenRes.on("data", (chunk) => {
          tokenData += chunk;
        });
        tokenRes.on("end", () => {
          const token = JSON.parse(tokenData);
          req.session.token = token;
          console.log(req.session);
=======
        let tokenData = '';
        tokenRes.on('data', (chunk) => {
          tokenData += chunk;
        });
        tokenRes.on('end', () => {
          const token = JSON.parse(tokenData);
          req.session.token = token;
          // console.log(req.session);
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
          if (token) {
            res.writeHead(302, {
              Location: `http://${process.env.frontendIPAddress}/home.html`,
            });
            res.end();
          }
        });
      }
    );
<<<<<<< HEAD
    tokenReq.on("error", (err) => {
=======
    tokenReq.on('error', (err) => {
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
      console.error(err);
    });
    tokenReq.write(postData);
    tokenReq.end();
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
<<<<<<< HEAD

    console.log(`Token: ${req.session.token.access_token}}`);
    const profileReq = https.request(
      "https://www.mycourseville.com/api/v1/public/users/me",
      profileOptions,
      (profileRes) => {
        let profileData = "";
        profileRes.on("data", (chunk) => {
          profileData += chunk;
        });
        profileRes.on("end", () => {
=======
    const profileReq = https.request(
      'https://www.mycourseville.com/api/v1/public/users/me',
      profileOptions,
      (profileRes) => {
        let profileData = '';
        profileRes.on('data', (chunk) => {
          profileData += chunk;
        });
        profileRes.on('end', () => {
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
          const profile = JSON.parse(profileData);
          res.send(profile);
          res.end();
        });
      }
    );
<<<<<<< HEAD
    profileReq.on("error", (err) => {
=======
    profileReq.on('error', (err) => {
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
      console.error(err);
    });
    profileReq.end();
  } catch (error) {
    console.log(error);
<<<<<<< HEAD
    console.log("Please logout, then login again.");
=======
    console.log('Please logout, then login again.');
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
  }
};

// DONE #3.2: Send "GET" request to CV endpoint to get all courses that you enrolled
exports.getCourses = (req, _res) => {
  // You should change the response below.
  const courseReq = https.request(
<<<<<<< HEAD
    "https://www.mycourseville.com/api/v1/public/get/user/courses",
=======
    'https://www.mycourseville.com/api/v1/public/get/user/courses',
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
    {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    },
    (res) => {
<<<<<<< HEAD
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
=======
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
        const profile = JSON.parse(data);
        _res.send(profile);
        _res.end();
      });
    }
  );
<<<<<<< HEAD
  courseReq.on("error", (err) => {
=======
  courseReq.on('error', (err) => {
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
    console.error(err);
  });
  courseReq.end();
};

// DONE #3.4: Send "GET" request to CV endpoint to get all course assignments based on cv_cid
exports.getCourseAssignments = (req, _res) => {
  const cv_cid = req.params.cv_cid;
  const assessmentReq = https.request(
<<<<<<< HEAD
    "https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=" +
=======
    'https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=' +
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
      cv_cid,
    {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    },
    (res) => {
<<<<<<< HEAD
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
=======
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
        const profile = JSON.parse(data);
        _res.send(profile);
        _res.end();
      });
    }
  );
<<<<<<< HEAD
  assessmentReq.on("error", (err) => {
=======
  assessmentReq.on('error', (err) => {
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
    console.error(err);
  });
  assessmentReq.end();
};

// Outstanding #2
exports.getAssignmentDetail = (req, res) => {
  const itemid = req.params.item_id;
  // You should change the response below.
<<<<<<< HEAD
  res.send("This route should get assignment details based on item_id.");
=======
  res.send('This route should get assignment details based on item_id.');
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
  res.end();
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect(`http://${process.env.frontendIPAddress}/login.html`);
  res.end();
};

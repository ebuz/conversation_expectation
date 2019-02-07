const fs = require('fs');
const path = require('path');
const express = require('express');
const multer  = require('multer');
const bodyParser  = require('body-parser');
const mkdirp = require('mkdirp');

let app = express();
let router = express.Router();

let server = require('http').createServer(app);

// const db = require('./db.js');

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.use('/recordings', express.static(path.join(__dirname, 'recordings')));

const recordingFilter = (req, file, cb) => {
    // accept audio only
    if (!file.originalname.match(/\.(ogg|webm)$/)) {
        return cb(new Error('Only audio files are allowed!'), false);
    }
    cb(null, true);
};

const recordingDestination = './recordings/';
const assignmentDestination = './assignments/';

const recordingStorage = multer.diskStorage({
    destination: recordingDestination,
    filename: function (req, file, cb) {
        mkdirp(path.join(recordingDestination, req.params.speakerid),
            err => cb(err, `${req.params.speakerid}/${file.originalname}`));
    }
})
const assignmentStorage = multer.diskStorage({
    destination: assignmentDestination,
    filename: function (req, file, cb) {
        cb(null, `${req.body.assignmentId}.json`);
    }
})

const recordingUpload = multer({
    storage: recordingStorage,
    fileFilter: recordingFilter,
});

const assignmentUpload = multer({
    storage: assignmentStorage,
});

router.post('/recording/:speakerid', recordingUpload.single('recording'),
    function(req, res, next) {
        console.log(`got recording ${req.file.originalname} from ${req.params.speakerid}`)
        res.sendStatus(200)
    });

const urlencodedParser = bodyParser.urlencoded({ extended: true })

const saveAssignment = (req, res) => {
    if (!req.body) {
        console.log(`req has no body, sending 400`)
        return res.sendStatus(400)
    }
    if (!req.body.assignmentId || !req.body.data) {
        console.log('no assignmentId or no data, sending 400')
        return res.sendStatus(400)
    }
    console.log('saving assignment')
    fs.writeFile(
        path.join(assignmentDestination, `${req.body.assignmentId}.json`),
        req.body.data, (err) => {
            if (err) {
                console.log('problem with saving file, sending 500')
                res.sendStatus(500);
            }
            res.sendStatus(200);
        });
};

// const commitToDb = async (pool, insertFrame, insertValues) => {
//     const client = await pool.connect()
//     try {
//         await client.query('BEGIN')
//         if(insertValues){
//             await client.query(insertFrame, insertValues)
//         } else {
//             await client.query(insertFrame)
//         }
//         await client.query('COMMIT')
//     } catch (e) {
//         await client.query('ROLLBACK')
//         throw e
//     } finally {
//         client.release()
//     }
// }

// const saveAssignmentToDb = (req, res) => {
//     if (!req.body) {
//         console.log(`req has no body, sending 400`)
//         return res.sendStatus(400)
//     }
//     if (!req.body.data) {
//         console.log('no data, sending 400')
//         return res.sendStatus(400)
//     }
//     console.log('saving assignment to db')
//     commitToDb(db.pool,
//         'INSERT INTO assignments(assignmentId, data, datab) VALUES($1, $2, $3);',
//         [req.body.assignmentId, req.body.data, req.body.data])
//         .then(dbResponse => {
//             res.sendStatus(200);
//         })
//         .catch(e => {
//             // save to disk as fall back?
//             // will need to disable early fail if db isn't available
//             console.log(e);
//             res.sendStatus(500);
//         })
// };

router.post('/submitassignment',
    (req, res, next) => {
        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            next() //pass request onto bodyParser
        } else {
            next('route') //pass request onto multer
        }
    }, urlencodedParser, saveAssignment);

router.post('/submitassignment', assignmentUpload.none(), saveAssignment);

// router.use(express.static(__dirname + '/build'));

router.get('/*', function (req, res) {
    res.sentStatus(404);
    // res.sendFile(path.join(__dirname, './build', 'index.html'));
});

app.use('/', router);

// const serverDBStartup = () => {
//     commitToDb(db.pool,
//         'CREATE TABLE IF NOT EXISTS assignments ( \
//             id serial PRIMARY KEY NOT NULL, \
//             assignmentId text, \
//             data json NOT NULL, \
//             datab jsonb NOT NULL);')
//         .then(async (dbResponse) => {
//             const { rows } = await db.pool.query('SELECT NOW()');
//             console.log(rows);
//         })
//         .catch(err => {
//             console.log(err);
//             console.log('issues connecting to database, exiting!');
//             process.exit(-1);
//         });
// };

const serverPort = 6969;
server.listen(serverPort, () => {
    // serverDBStartup();
    console.log('listening on port ' + serverPort)
});

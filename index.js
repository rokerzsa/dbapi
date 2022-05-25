const express = require('express');
const Joi = require('joi');
const fs = require('fs');
const { resourceLimits } = require('worker_threads');
const app = express();
app.use(express.json());


const gpsFileName = './data/gps/data.json';
const gpsjsonFile = require(gpsFileName);


function validateCoordinates(coordinates) {
    const schema = Joi.object({
        key: Joi.number().required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required()
    });
    return schema.validate(coordinates);
}


app.get('/api/gps', (req, res) => {
    res.json(gpsjsonFile);
});
app.post('/api/gps', (req, res) => {
    const validation = validateCoordinates(req.body);
    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }
    else {
        if (req.body.key != 123) {
            res.status(400).send("Need an api key");
            return;
        }
        else {
            if (!req.body.latitude || !req.body.longitude) {
                res.status(400).send("Request not recognized");
                return;
            }
            else {
                gpsjsonFile.latitude = req.body.latitude;
                gpsjsonFile.longitude = req.body.longitude;
                fs.writeFile(gpsFileName, JSON.stringify(gpsjsonFile, null, 2), function writeJSON(err) {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        res.json(gpsjsonFile);
                    }
                });
            }
        }
    }
});


const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening to port ${port}`))
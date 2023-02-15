const express = require('express');
const ExpressError = require('./expressError');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/mean', (req, res, next) => {
    const { nums = 'none' } = req.query;
    try {
        if (nums !== 'none') {
            let numsArr = nums.split(',');
            let sum = 0;
            let count = 0;
            for (let num of numsArr) {
                if (isNaN(num) === true) {
                    throw new ExpressError(`${num} is not a number`, 400);
                } else {
                    sum += Number(num);
                    count++;
                }
            }
            let mean = sum / count;
            return res.json({
                response: {
                    operation: 'mean',
                    value: mean,
                },
            });
        } else {
            throw new ExpressError(
                'Invalid search query. Must include list of comma seperated numbers: "nums=1,2,3,4,5"'
            );
        }
    } catch (error) {
        next(error);
    }
});

app.get('/median', (req, res, next) => {
    const { nums = 'none' } = req.query;
    try {
        if (nums !== 'none') {
            let numsArr = nums.split(',');
            let count = 0;
            for (let num of numsArr) {
                if (isNaN(num) === true) {
                    throw new ExpressError(`${num} is not a number`, 400);
                } else {
                    count++;
                }
            }
            if (count % 2 !== 0) {
                mid = (count + 1) / 2;
                let sorted = numsArr.sort();
                median = Number(sorted[mid - 1]);
                return res.json({
                    response: {
                        operation: 'median',
                        value: median,
                    },
                });
            } else {
                let sorted = numsArr.sort();
                mid1 = count / 2;
                mid2 = mid1 + 1;
                median =
                    (Number(sorted[mid1 - 1]) + Number(sorted[mid2 - 1])) / 2;
                return res.json({
                    response: {
                        operation: 'median',
                        value: median,
                    },
                });
            }
        } else {
            throw new ExpressError(
                'Invalid search query. Must include list of comma seperated numbers: "nums=1,2,3,4,5"'
            );
        }
    } catch (error) {
        next(error);
    }
});

app.get('/mode', (req, res, next) => {
    const { nums = 'none' } = req.query;
    try {
        if (nums !== 'none') {
            let numsArr = nums.split(',');
            let highCount = 1;
            let mode = 'none';
            for (let num of numsArr) {
                if (isNaN(num) === true) {
                    throw new ExpressError(`${num} is not a number`, 400);
                } else {
                    if (numsArr.length === 1) {
                        mode = num;
                        return res.json({
                            response: {
                                operation: 'mode',
                                value: mode,
                            },
                        });
                    } else {
                        let numReps = numsArr.filter((nums) => nums === num);
                        if (numReps.length > highCount) {
                            highCount = numReps.length;
                            mode = num;
                        }
                    }
                }
            }
            return res.json({
                response: {
                    operation: 'mode',
                    value: mode,
                },
            });
        } else {
            throw new ExpressError(
                'Invalid search query. Must include list of comma seperated numbers: "nums=1,2,3,4,5"'
            );
        }
    } catch (error) {
        next(error);
    }
});

app.use((req, res, next) => {
    let e = new ExpressError('Page Not Found', 404);
    next(e);
});

app.use((error, req, res, next) => {
    let err = error.status || 500;
    let msg = error.msg;
    return res.status(err).send(msg);
});

app.listen(3000, function () {
    console.log('App on port 3000');
});

const Joi = require("joi");
const { v4: uuidv4 } = require('uuid');

let dataMap = new Map();

// add product
exports.addreceipt = async (req, res) => {
    try {
        console.log('request::', req.body);

        let inputData = req.body;

        const itemSchema = Joi.object({
            shortDescription: Joi.string().pattern(/^[\w\s!@#$%^&*()\-+=\\\/.,<>?[\]{}|~`'":;]+$/u).required().example("Mountain Dew 12PK"),
            price: Joi.string().pattern(/^\d+\.\d{2}$/).required().example("6.49")
        });

        let validation = Joi.object().keys({
            retailer: Joi.string().pattern(/^[\w\s!@#$%^&*()\-+=\\\/.,<>?[\]{}|~`'":;]+$/u).required().example("M&M Corner Market"),
            purchaseDate: Joi.string().isoDate().required().example("2022-01-01"),
            purchaseTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required().example("13:01"),
            items: Joi.array().min(1).items(itemSchema),
            total: Joi.string().pattern(/^\d+\.\d{2}$/).required().example("6.49")
        });
        let result = validation.validate(inputData, { abortEarly: false });
        if (result.error) {
            let data = result.error.details[0].message.replace(/[."*+\-?^${}()|[\]\\]/g, "");
            throw { message: data };
        }

        let receiptId = uuidv4();
        dataMap.set('uuid', receiptId);
        dataMap.set('retailer', inputData.retailer);
        dataMap.set('purchaseDate', inputData.purchaseDate);
        dataMap.set('purchaseTime', inputData.purchaseTime);
        dataMap.set('total', inputData.total);

        // Set items in the map
        dataMap.set('items', inputData.items);

        res.status(200).json({ id: dataMap.get('uuid') })

    } catch (err) {
        console.log('Error inside catch::', err.message);
        res.status(400).json({ err: err.message });
    }
}

function mapToObject(map) {
  const obj = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

exports.retrievePoint = async (req, res) => {
    try {
        console.log('req.params:::', req.params);
        const id = req.params.id;
        console.log('id', id);
        console.log(dataMap.get('uuid')); // Output: value1
        //logic
        let points = 0;
        let receipt = mapToObject(dataMap);

        // Rule 1: One point for every alphanumeric character in the retailer name.
        points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, "").length;

        // Rule 2: 50 points if the total is a round dollar amount with no cents.
        if (Number.isInteger(parseFloat(receipt.total))) {
            points += 50;
        }

        // Rule 3: 25 points if the total is a multiple of 0.25.
        if (parseFloat(receipt.total) % 0.25 === 0) {
            points += 25;
        }

        // Rule 4: 5 points for every two items on the receipt.
        points += Math.floor(receipt.items.length / 2) * 5;

        // Rule 5: If the trimmed length of the item description is a multiple of 3,
        // multiply the price by 0.2 and round up to the nearest integer.
        receipt.items.forEach(item => {
            const trimmedLength = item.shortDescription.trim().length;
            if (trimmedLength % 3 === 0) {
                points += Math.ceil(parseFloat(item.price) * 0.2);
            }
        });

        // Rule 6: 6 points if the day in the purchase date is odd.
        const purchaseDay = new Date(receipt.purchaseDate).getDate();
        if (purchaseDay % 2 !== 0) {
            points += 6;
        }

        let hours = parseInt(receipt.purchaseTime.split(':')[0]);

        if (hours >= 14 && hours < 16) { 
                points += 10;
        }

        console.log('Points::1::', points);

        res.status(200).json({ points: points });
    } catch (err) {
        console.log('Error::retrievePoint:: ', err.message);
        res.status(400).json({ err: err.message });
    }
}
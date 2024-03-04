# Receipt Processor

Calculates the points for given receipt. 

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Docker installed on your system.
- set env file with below values
  PORT = 3000 TOKEN = YRFwJUGZTj1Dzo5jrWGYOc0LjASZwwAP

## Steps to Use the API

1. Build Docker Image
```text
$ docker build -t <filename> .
```


3. Run the Docker file
$ docker run -p 3000:3000 <filename>

4. To create receipt please use below CURL command.

```json

curl --location 'http://localhost:3000/api/receipts/process' \
--header 'token: <token>' \
--header 'Content-Type: application/json' \
--data '{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },{
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },{
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },{
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },{
      "shortDescription": "    Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}'

```

4. To get the points please using below CURL command
* please replace {id} with the actual UUID from the above API response.

```json

curl --location 'http://localhost:3000/api/receipts/{id}/points' \
--header 'token: <token>'

```




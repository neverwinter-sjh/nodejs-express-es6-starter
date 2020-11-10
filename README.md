# FNS API Server

FNS Project API Server for Mockup

## Stacks

- Nodejs
- Expressjs
- MongoDB
- ES6

## Installation

Clone the repository and run `npm install`

```
npm install
```

## Starting the server

```
npm start
```

The server will run on port 3000. You can change this by editing `config.dev.js` file.

## Endpoint

- BaseUrl : http://192.168.0.100

- Register: [POST] /user/register

```
{
  userid: (string),
  password: (string),
  phone_number: (string)
}
```

- Login: [POST] /user/login

```
{
  userid: (string),
  password: (string)
}
```

- Chat BroadCast: [POST] /chat/broadcast

```
{

}
```

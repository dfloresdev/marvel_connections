# :sunglasses: Marvel App :tada:

In this app you can see a superheros and they collaborators, this app have two services:

### Service A

Extract all related Editor, Writers and Colorist with the superhero.
You can test this functionality in **[this link](https://marvel-4d6ytbdwza-uc.a.run.app/#/Collaborators/getColl)**

If you wish sync up other superhero, you can use **[this extra service](https://marvel-4d6ytbdwza-uc.a.run.app/#/Collaborators/getSyncup)** only type the name of superhero

### Service B

Extract all related characters with the superhero.
You can test this functionality in **[this link](https://marvel-4d6ytbdwza-uc.a.run.app/#/Characters/getChar)**

If you wish sync up other superhero, you can use **[this extra service](https://marvel-4d6ytbdwza-uc.a.run.app/#/Characters/getSyncupChar)** only type the name of superhero

## A little bit of documentation

**Full documentation:**

#### `https://marvel-4d6ytbdwza-uc.a.run.app/`

#### Architecture

These components can be turned into microservices

![Strucuture of components](https://i.imgur.com/NdsOEuX.png)

## About of project

This project run with nodejs with express

**Note:** You need a apiKey to run the project, follow the [this documentation](https://developer.marvel.com/account) to create apikey

Add apikey in the file **.env** with timestamp(ts), hash md5 and public key.

#### Run project

- Step 1

#### `npm install`

- Step 2

#### `npm run start`

The server run in Cloud Run with containers

## Follow me

Anywhere @dfloresdev

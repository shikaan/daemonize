Damien
---
Running Node applications as a deamon by means of child processes

![Damien](https://vignette.wikia.nocookie.net/spsot/images/a/a9/Damien_facebook_profile.png/revision/latest/scale-to-width-down/310?cb=20141118144819)

## Why?

* :closed_lock_with_key: secure and dependency free;
* :hatching_chick: tiny and understandable codebase;

## Installation

Global installation

```
npm install -g damien
```

Local installation

```
npm install --save-dev damien
```

## Usage

Global usage
```
damien ./index.js
```

Local usage
```
npx damien ./index.js
```

As NPM script
```
{
  "name": "my-app",
  "main": "lib/server.js",
  "scripts": {
    "start": "damien ./lib/server.js"
  },
  "devDependencies": {
    "damien": "*"
  }
}
```
# React API Test

This is just a (relatively) simple test to get an API working in React.
Unfortunately, the actual API source did not have CORS set properly, so I simply saved a local copy of it for testing purposes.

## How to Run

After cloning this repository, make sure the [serve](https://www.npmjs.com/package/serve) npm package is installed:

```shell
$ npm install -g serve
```

Then start the local server:

```shell
$ serve -s build
```

Finally, navigate your web browser to `localhost:5000`.

Enjoy!

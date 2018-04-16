# somnus-app

[![Build Status](https://travis-ci.org/upkbs-chronobiology/somnus-app.svg?branch=master)](https://travis-ci.org/upkbs-chronobiology/somnus-app)

App for collecting sleep log answers, connecting to the somnus main application.

## Technology stack
This project is based on [Ionic](https://ionicframework.com/) (with [Cordova](https://cordova.apache.org/)).

## Running

After setting up Ionic, run `ionic serve` to launch the app on localhost for development.

## Testing

In order to execute Karma/Jasmine (unit) tests, run `npm test`.

### Integration tests

Before running integration tests, make sure a non-critical instance of the back end Somnus application is running, reachable, and has appropriate test users in place.
**Do not run integration tests against a production back end, since they alter data.**
Integration tests can then be executed with `npm test-integration`.

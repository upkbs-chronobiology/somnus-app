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

Before running integration tests, make sure a non-critical instance of the back end Somnus application is running, reachable, and has appropriate test users (with appropriate rights) in place; check *test-utils.ts* for details.
**Do not run integration tests against a production back end, since they alter data.**
Integration tests can then be executed with `npm test-integration`.

## Release

In order to build a production release, do `ionic cordova build <platform> --release --prod`.

### Versioning

We currently don't use an automated releasing/versioning system, so bump versions manually and add a git tag.

### Cordova plugin issues

For some reason, cordova plugins are sometimes not properly installed, leading to faulty behavior.
Look out for errors during plugin installation (e.g. during `ionic cordova platform add <platform>`).

Things that *might* help (each on its own, not necessarily in sequence):

- `ionic cordova platform remove <platform>`, then `ionic cordova platform add <platform>`
- `ionic cordova prepare`
- Re-add each plugin individually

For example, in some cases, the prod-built app on phones fails to make requests to the server; they fail with 404 (allegedly from cache).
This is caused by `cordova-plugin-whitelist` not being properly installed.
Just re-add it and everything should work as expected.

Background info: https://forum.ionicframework.com/t/api-request-404-from-cache-on-android-device/110012/3

### Unwanted resources generation

By default, Ionic generates resources during platform-add. Prevent this by adding the `--no-resources` flag.

## Troubleshooting

### node-sass build fails

This might surface as a failing ionic build, npm install or node-sass rebuild.
The error message contains something along the lines of:

> Error: `make` failed with exit code: 2

And further up errors stemming from C++ code compilation (probably referring to v8).

This can be caused by API mismatches between v8 and node-sass, meaning that the versions of node and node-sass are not compatible.
If the same build used to work before and/or on other machines, it probably had a different node version installed.

These are Cordova resources. You can replace icon.png and run
`ionic cordova resources -i` to generate custom icons for your
app. See `ionic cordova resources --help` for details.

**Do not generate splash screens, as we don't use any in this app.**
The `-i` flag signals to only generate icons.

Cordova reference documentation:

- Icons: https://cordova.apache.org/docs/en/latest/config_ref/images.html
- Splash Screens: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/

## Rounded corners for Android icons

In order to round the corners of already generated Android icons, run `./round-corners-android.sh` from here,
or provide the resources base path as an argument.

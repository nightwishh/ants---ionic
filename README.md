# AccountAnts

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## How to Get and Build Solution
get packages then
1. Remove `Package-lock.json`
2. run `npm install`
3. test run `ionic serve`
4. (Optional) test run `ng serve`
5. Prepare project for mobile 
// For Android
`ionic cordova prepare android`
if some errors happened, like `could not find necessary files ./config.xml` folder not found
run `ionic integrations enable cordova --add` this will enable integration with cordova for this project and downloads `resources` folder for android
if `resources/something.xx` not found then run again remove `ionic cordova platform rm android`, manually remove config.xml and `ionic integrations enable cordova --add`
// For iOS
`ionic cordova prepare ios`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

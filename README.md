# UND Inventory Management System

### Working with Mobile App
Global packages required:
* [Cordova](https://cordova.apache.org/)
* [Ionic](http://ionicframework.com/)
* [Grunt](http://gruntjs.com/)
```
npm install -g cordova ionic grunt
```
Switch to app-dev branch
Install Dependencies and Restore Project
```
npm install
bower install
grunt
ionic state restore
```
You will want to have two bashes open, one for grunt watch and another for ionic serve.
Run grunt watch to watch the js and css files for changes to rebuild
```
grunt watch
```
Run ionic serve to serve the mobile app to your browser on localhost
```
ionic serve
```

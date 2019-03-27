var fs = require('fs');

// get package json as an object.
var jsonObject = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// get the version #
var version = jsonObject.version;
console.log('Current Version: ' + version);

// now copy to the libraries
var librariesToCopy = [
  './projects/angular-logging-appinsights/package.json'
];

for (var i = 0; i < librariesToCopy.length; i++) {
  var library = librariesToCopy[i];

  var libraryJsonObject = JSON.parse(fs.readFileSync(library, 'utf8'));
  libraryJsonObject.version = version;
  var libraryJsonString = JSON.stringify(libraryJsonObject, null, 2);

  console.log('Updated ' + library + ' to ' + version);
  fs.writeFileSync(library, libraryJsonString);
}

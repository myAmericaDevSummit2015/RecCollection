## RecCollection
A proof of concept thick client to RecCollector. Its goal is to provide
Recreation Information Database (RIDB) site information by location in an
accessible way. 

Built on Bluemix

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=#CHANGME)

#### Introduction
RecCollection is a project that began its life as a hackathon effort by a team
of [IBMers] (www.ibm.com) as a part of [MyAmerica Developer Summit 2015]
(openglobe.github.io/myamerica-devsummit/), an effort hosted by the USDA and
DOI to get private industry, government and citizens developing value from 
RIDB and the greater public recreational data ecosystem.

RecCollection is built as a proof of concept mobile brower-based interface to
[RecCollector] (https://github.com/myAmericaDevSummit2015/RecCollector). It
aims to display RIDB sites based on location and provided relevant additional
information about each site in an accessible way.

RecCollection is designed to be behavior driven, modular and in keeping with the
traditions of the [Unix Philosophy] (http://www.ru.j-npcs.org/usoft/WWW/LJ/Articles/unixtenets.html).

#### Dependencies
- [RecCollector] (https://github.com/myAmericaDevSummit2015/RecCollector)
- [Npm] (https://www.npmjs.com/)
- [Node.js] (http://nodejs.org);
- [Jade] (http://jade-lang.com/)
- [Express] (http://expressjs.com/)
- [Leaflet] (http://leafletjs.com/)
- [MapBox Key] (https://www.mapbox.com/)
- [Intel App Framwork] (http://app-framework-software.intel.com/)

*See package.json for programming stack*

#### Configuration and Setup
###### Environment Variables
- PENDING 

###### General
- Install Node.js and Npm
- In working directory, run "npm install"
- Run application with "npm start"
- Test with "npm test"

###### Notes
- Uses HTTP Basic Authentication to an HTTPS endpoint to retreve token
- Makes calls with token in HTTP Header for subsequent requests

#### Contributing
Feel free to contribute using both Github's Issues and Pull Request. Specs are
expected. If you stick to code conventions, it would be appreciated.

#### Resources
- [RIDB] (http://usda.github.io/RIDB/#introduction)
- [USDA] (http://www.usda.gov/wps/portal/usda/usdahome)
- [DOI] (http://www.doi.gov/index.cfm)
- [IBM] (http://www.ibm.gov)

#### License
[Apache 2.0] (https://www.apache.org/licenses/LICENSE-2.0)

#### Issues
Use Github's Issues

# Tweet-Server - A JavaScript written backend used by the [Tweet-Client](https://github.com/xxiFear/xxifear.github.io/tree/master)

Tweet-Server is a JavaScript written backend which connects to a (local) MongoDB database and offers RESTful webservices which are, for example, used by the [Tweet Client](https://github.com/xxiFear/xxifear.github.io/tree/master).

## Getting Started

For developing and testing purposes, clone a copy of the current master branch to your local machine and open the project using an Integrated Development Environment like WebStorm.

You can then start the server by using the IDE's run or debug feature. The REST API is published on port 4000. NodeJS and a running instance of MongoDB database is required. Look down for further details on how to get everything up and running.

### Prerequisites/Installing

NodeJS must be installed first in order to use the Node Package Manager (NPM) which is required to install all project dependencies. Install it by downloading and running the latest version from [NodeJS.org](https://nodejs.org/en/).
Having finished the installation of NodeJS, go ahead and install MongoDB by downloading and installing the latest version from their [Website](https://www.mongodb.com).
Start the database by opening and running the following command in a local console window: '"Path\To\mongod.exe" -dbpath "PATH\To\DatabaseFile"'.
If the MongoDB instance is running, the server will be able to connect using the default localhost baseUrl defined in the project. Change it to your needs if required.

## Deployment

You can deploy the project (Server) on [Heroku](https://www.heroku.com). The database can be deployed on a cloud-hosted MongoDB Service like [mLab](https://mlab.com). Make sure to adjust the baseUrl used by the server to connect to the database.

## Built With

* [NodeJS](https://nodejs.org) - The JavaScript runtime built on Chrome's V8 JavaScript engine

## Versioning

New versions are tagged within the master branch

## Authors

* **Matthias Nord** - *Everything* - [xxiFear](https://github.com/xxifear)


## Acknowledgments

* This project was created as assignment for the course Developing Modern Web Applications Using NodeJS (DMAS).

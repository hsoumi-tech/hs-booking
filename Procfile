db: docker start -a ${DB_NAME} || docker run --name ${DB_NAME} -p ${DB_PORT}:27017 mongo:4.0

api: sleep 2 &&  nodemon -r esm src/server.js
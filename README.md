# Installation
* Clone it
```bash
git clone https://github.com/daemonraco/mean-startup.git
cd mean-startup
```
* Initialize it
```bash
npm run init
```

# Usage
## Launching the server
```bash
node server.js
```
We recommend to use `nodemon`.

### Launching the server with HTTPS
```bash
PORT_SSL=3001 node server.js
```
### Launching the server with MongoDB
```bash
DB_NAME=mydb node server.js
```

## Launching the client
```bash
cd client
ng serve
```
Again, we recommend to use nodemon

# Publishing
## Build it
```bash
npm run build
```

## Build only client
```bash
npm run build-client
```

const fs = require('fs')
const path = require('path')

const serviceWorkerFile = path.resolve(process.cwd(), 'dist/service-worker.js')

fs.readFile(serviceWorkerFile, 'utf8', (err, data) => {
    if (err) console.error(err)
    
    const result = data.replace("'url':'/index.html'", "'url':'/200.html'")

    fs.writeFile(serviceWorkerFile, result, 'utf8', function (err) {
        if (err) return console.log(err);
     });
})
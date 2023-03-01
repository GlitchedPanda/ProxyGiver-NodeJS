const express = require('express')
const fs = require('fs')

const app = express()
const config = require('./config.json')
const port = config.port

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let proxiesJSON = {
    "proxy":"null",
    "remaining-proxies":"0"
}

app.get('/', (req, res) => {
    let proxies = fs.readFileSync(config.proxy_directory, "utf8").split(/\r?\n/)

    let randomInt = getRandomInt(0, proxies.length - 1)
    let proxy = proxies[randomInt]

    proxiesJSON = {
        "proxy":proxy,
        "remaining-proxies": fs.readFileSync(config.proxy_directory, "utf8").split(/\r?\n/).length - 1
    }

    if(!proxy) {
        proxiesJSON = {
            "proxy":"null",
            "remaining-proxies":"0"
        }
    } 
    if(proxy == '') {
        proxiesJSON = {
            "proxy":"null",
            "remaining-proxies":"0"
        }
    }

    res.send(JSON.stringify(proxiesJSON))

    let proxies2 = fs.readFileSync(config.proxy_directory, "utf8").split(/\r?\n/)


    const usedproxies = fs.readFileSync(config.used_proxy_directory, 'utf-8') + proxies2[randomInt]
    fs.writeFileSync(config.used_proxy_directory, usedproxies + "\n")

    proxies2.splice(randomInt, 1);
    const updatedContents = proxies2.join('\n');
    fs.writeFileSync(config.proxy_directory, updatedContents);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
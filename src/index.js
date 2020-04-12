const bump = require('./bump.js')

const myConst = "Hello"
console.log(myConst)
console.log("Break !")
console.log("Break !")
console.log("Break !")
console.log("Break !")

bump.getType()
    .then(type => bump.getNextVersion(type))
    .then((versions) => {
        console.log('Next version', versions.nextVersion)
        console.log('Next minor', versions.nextSnapshot)
    })
    .catch(error => console.log(error))
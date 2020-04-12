import { getVersions } from './bump'

getVersions({
    preset: `conventionalcommits`,
    tagPrefix: ''
}).subscribe((versions) => {
    console.log(versions)
})




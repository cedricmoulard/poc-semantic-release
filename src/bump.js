const conventionalRecommendedBump = require(`conventional-recommended-bump`);
const gitSemverTags = require('git-semver-tags');
const semver = require('semver')

exports.getType = function getType() {

    return new Promise(((resolve, reject) => {

        conventionalRecommendedBump({
            preset: `conventionalcommits`,
            tagPrefix: ''
        }, (error, recommendation) => {

            if (error) {
                return reject()
            }
            return resolve(recommendation.releaseType)
        });
    }))
}

exports.getNextVersion = function getNextVersion(type) {
    return new Promise((resolve, reject) => {
        gitSemverTags(function (err, tags) {

            if (err) {
                return reject()
            }

            let nextVersion = '1.0.0'
            if (!!tags && tags.length > 0) {
                nextVersion = semver.inc(tags[0], type)
            }

            const nextSnapshot = semver.inc(nextVersion, 'minor')

            return resolve({
                nextVersion,
                nextSnapshot
            })

        });
    })
}

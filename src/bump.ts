import conventionalRecommendedBump from 'conventional-recommended-bump'
import gitSemverTags from 'git-semver-tags'
import semver from 'semver'
import { Versions } from './versions.model';
import { Observable, Observer } from 'rxjs';
import { Configuration } from './configuration.model';
import { mergeMap } from 'rxjs/operators';

function getType(configuration: Configuration): Observable<string> {

    return new Observable((observer: Observer<string>) => {

        conventionalRecommendedBump(configuration, (error, recommendation) => {

            if (!!error) {
                observer.error(error)
            } else {
                observer.next(recommendation.releaseType)
                observer.complete()
            }
        });
    })
}

function extractVersions(type: string, configuration: Configuration): Observable<Versions> {

    return new Observable((observer: Observer<Versions>) => {
        gitSemverTags(configuration, function (error, tags) {

            if (!!error) {
                observer.error(error)
            } else {

                let lastVersion = '0.0.0'
                let nextVersion = '1.0.0'
                if (!!tags && tags.length > 0) {
                    const regex = /^(.*)[1-9].*/gi;
                    lastVersion = tags[0].replace(regex, function (tag, $1) {
                        return tag.substring($1.length)
                    })
                    nextVersion = semver.clean(lastVersion, {loose: true})
                    nextVersion = semver.inc(nextVersion, type)
                }

                const nextSnapshot = `${ semver.inc(nextVersion, 'minor') }-SNAPSHOT`

                observer.next({
                    lastVersion,
                    nextVersion,
                    nextSnapshot
                })
                observer.complete()

            }

        });
    })
}

export function getVersions(configuration: Configuration): Observable<Versions> {
    return getType(configuration).pipe(
        mergeMap(type => extractVersions(type, configuration))
    )
}

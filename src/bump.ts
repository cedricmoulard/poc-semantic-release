import * as conventionalRecommendedBump from 'conventional-recommended-bump'
import * as gitSemverTags from 'git-semver-tags'
import * as semver from 'semver'
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

function extractVersions(type): Observable<Versions> {

    return new Observable((observer: Observer<Versions>) => {
        gitSemverTags(function (error, tags) {

            if (!!error) {
                observer.error(error)
            } else {

                let lastVersion = '0.0.0'
                let nextVersion = '1.0.0'
                if (!!tags && tags.length > 0) {
                    lastVersion = tags[0]
                    nextVersion = semver.inc(tags[0], type)
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
        mergeMap(type => extractVersions(type))
    )
}

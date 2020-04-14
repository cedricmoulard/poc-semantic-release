import { getVersions } from './'
import meow from 'meow'
import { AnyFlags, Options } from 'meow'

const options: Options<AnyFlags> = {
    autoHelp: true,
    autoVersion: true,
    flags: {
        preset: {
            type: 'string',
            default: 'conventionalcommits',
            alias: 'p'
        },
        verbose: {
            type: 'boolean',
            alias: 'v'
        },
        'tag-prefix': {
            default: '',
            alias: 't'
        }
    }
}

const cli = meow(`
    Options
      -p, --preset                   Name of the preset you want to use
      -v, --verbose                  Verbose output
      -t, --tag-prefix               Tag prefix to consider when reading the tags
`, options
)

getVersions(cli.flags).subscribe((versions) => {
    console.log(JSON.stringify(versions))
})


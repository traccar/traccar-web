#!/usr/bin/env python3

import os
import optparse
import requests
from transifex.api import transifex_api

parser = optparse.OptionParser()
parser.add_option("-t", "--token", dest="token", help="transifex token")

(options, args) = parser.parse_args()

if not options.token:
    parser.error('Token is required')

os.chdir(os.path.dirname(os.path.abspath(__file__)))

transifex_api.setup(auth=options.token)

organization = transifex_api.Organization.get(slug='traccar')
project = organization.fetch('projects').get(slug='traccar')
resource = project.fetch('resources').get(slug='web')
languages = project.fetch('languages')

for language in languages:
    print(language.code)
    url = transifex_api.ResourceTranslationsAsyncDownload.download(resource=resource, language=language)
    result = requests.get(url)
    with open('../src/resources/l10n/' + language.code + '.json', "w") as file:
        file.write(result.text)

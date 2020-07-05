#!/usr/bin/env bash

cd $(dirname $0)

./minify.sh

cd $(dirname $0)/../modern

npm run build_release
mv build ../web/modern

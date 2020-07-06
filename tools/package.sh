#!/usr/bin/env bash

cd $(dirname $0)

./minify.sh

cd ../modern

npm run build_release
mv build ../web/modern

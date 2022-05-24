#!/usr/bin/env bash

cd $(dirname $0)

cd ..

rm -r web/lib
npm install --unsafe-perm
npm run build

cd modern

rm -r ../web/modern
npm install
npm run build_release
mv build ../web/modern

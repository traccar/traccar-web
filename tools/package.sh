#!/usr/bin/env bash

cd $(dirname $0)

cd ..

rm -rf web/lib
npm install --unsafe-perm
npm run build

cd modern

rm -rf ../web/modern
npm install
npm run build_release
mv build ../web/modern

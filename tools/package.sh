#!/usr/bin/env bash

cd $(dirname $0)
cd ..

rm -rf web/lib
npm ci --unsafe-perm
npm run build

cd modern

rm -rf build
npm ci
npm run build

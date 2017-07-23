#!/bin/sh

cd $(dirname $0)/../web

# Sencha Variables
SENCHAROOT="../../.."
SDK="${SENCHAROOT}/ext-6.2.0"

INPUTFILE="app.js"
OUTPUTFILE="app.min.js"
APPDIR="app"

sencha compile --classpath="${INPUTFILE}","${APPDIR}","${SDK}/packages/core/src","${SDK}/packages/core/overrides","${SDK}/classic/classic/src","${SDK}/classic/classic/overrides" \
       exclude -all \
       and \
       include -recursive -file "${INPUTFILE}" \
       and \
       exclude -namespace=Ext \
       and \
       concatenate -closure "${OUTPUTFILE}"


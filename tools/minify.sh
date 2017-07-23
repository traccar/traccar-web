#!/bin/sh

cd $(dirname $0)/../web

# Sencha Variables
SENCHAROOT="../../.."
SDK="${SENCHAROOT}/ext-6.2.0"
CORE="${SDK}/packages/core"
CLASSIC="${SDK}/classic/classic"

INPUTFILE="app.js"
OUTPUTFILE="app.min.js"
APPDIR="app"

# Assemble CLASSPATH
CLASSPATH="${INPUTFILE},${APPDIR}" 

for d in "${CORE}" "${CLASSIC}"
do
	for e in "src" "overrides"
	do
		if [ ! -d "${d}/${e}" ]
		then
			echo "${d}/${e}: directory not found" 1>&2
			exit 2
		fi

		CLASSPATH="${CLASSPATH},${d}/${e}"
	done
done

# Minify
sencha compile \
	--classpath="${CLASSPATH}" \
	exclude -all and \
	include -recursive -file "${INPUTFILE}" and \
	exclude -namespace=Ext and \
	concatenate -closure "${OUTPUTFILE}"


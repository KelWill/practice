#!/usr/bin/env bash

set -e

if ! [ -f "$1" ]; then
  echo "unable to find $1";
  exit 1
fi

if node ./node_modules/.bin/tsc "$1" -outDir lib &> /dev/null; then
  echo "$1 SUCCESS!"
else
  echo "$1 FAILURE"
fi

#!/bin/bash

clear

query=$1

if [ -z $query ]; then
    echo "$0: no query provided"
    echo "usage: $0 <search_query>"
    exit 1
fi

temp_file=$(mktemp)

grep -rn $query . --include="*.js" --exclude-dir={.git} > $temp_file

count=$(wc -l < $temp_file)

cat $temp_file | sed 's/\([^:]*\)[[:space:]]*:[[:space:]]*\([^:]*\):[[:space:]]*/\n\1:\2\n/g'

echo && echo "found:" $count && echo

rm $temp_file
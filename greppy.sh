#!/bin/bash

query=$1

if [ -z $query ]; then
    echo "$0: no query provided"
    echo "usage: $0 <search_query>"
    exit 1
fi

temp_file=$(mktemp)

grep -rn $query . --include="*.js" --exclude-dir={.git} > $temp_file

count=$(wc -l < $temp_file)

cat $temp_file | sed 's/\([^:]*:[^:]*\):/\n\1:\n/g' | sed "s/.*$query/$query/"

echo && echo "found:" $count && echo

rm $temp_file
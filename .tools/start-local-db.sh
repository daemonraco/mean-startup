#!/bin/bash
#
P_MONGOD="$(which mongod)";
P_DBPATH="./.db";
#
echo -e "\e[32mChecking MongoDB:\e[0m";
if [ -z "$P_MONGOD" ]; then
    echo 'mongod is not present in $PATH' >&2;
fi | awk '{print "\t" $0}';
#
if [ -n "$P_MONGOD" ]; then
    echo -e "\e[32mChecking local DB directory:\e[0m";
    mkdir -vp "$P_DBPATH/data" | awk '{print "\t" $0}';
fi;
#
if [ -n "$P_MONGOD" ]; then
    echo -e "\e[32mStarting local DB:\e[0m";
    "$P_MONGOD" --dbpath "$P_DBPATH" | awk '{print "\t" $0}';
fi;
#

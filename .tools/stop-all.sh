#!/bin/bash
#
export __INCLUDED__='true';
. configs/shellconfig.sh;
#
if [ ! -e "$PIDS_FILE" ]; then
    echo -e "\e[31mThere's nothing running...\e[0m" >&2;
else
    still="";
    pids=$(cat "$PIDS_FILE");

    if [ -n "$pids" ]; then
        echo -e "\e[32mKilling processes...\e[0m";
        kill $pids 2>&1 | awk '{print "\t" $0}';

        echo -e "\e[32mChecking processes...\e[0m";
        for p in $pids; do
            if [ -n "$(ps|grep $p)" ]; then
                still="true";
                break;
            fi;
        done;
    fi;

    if [ -z "$still" ]; then
        echo -e "\e[32mRemoving process file...\e[0m";
        rm -f "$PIDS_FILE";
    else
        echo -e "\e[31mThere's something still running...\e[0m" >&2;
    fi;
fi;
#

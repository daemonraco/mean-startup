#!/bin/bash
#
export __INCLUDED__='true';
. configs/shellconfig.sh;
#
if [ -e "$PIDS_FILE" ]; then
    echo -e "\e[31mThere seems to be something running...\e[0m" >&2;
else
    #
    echo -e "\e[32mChecking logs directory ('$P_LOG_DIR')...\e[0m";
    mkdir -vp "$P_LOG_DIR" | awk '{print "\t" $0}';
    echo -n > "$PIDS_FILE";
    #
    if [ -n "$DB_NAME" ]; then
        log="$P_LOG_DIR/db.log";
        echo -e "\e[32mStarting MongoDB (log: '$log')...\e[0m";
        npm run local-db >"$log" 2>&1 &
        echo $! >> "$PIDS_FILE";
    fi;
    #
    log="$P_LOG_DIR/server.log";
    echo -e "\e[32mStarting Server (log: '$log')...\e[0m";
    npm start >"$log" 2>&1 &
    echo $! >> "$PIDS_FILE";
    #
    log="$P_LOG_DIR/client.log";
    echo -e "\e[32mStarting Client (log: '$log')...\e[0m";
    cd client;
    npm start >"../$log" 2>&1 &
    echo $! >> "../$PIDS_FILE";
    cd -;
    #
fi;
#
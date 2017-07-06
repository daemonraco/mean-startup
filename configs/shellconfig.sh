#
if [ -n "$__INCLUDED__" ]; then
    #
    # If you need your server to run in a different port, uncomment and change
    # this variable.
    #export PORT=3000;

    #
    # If you need your HTTPS server to run in a different port, uncomment and
    # change this variable.
    #export PORT_SSL=3001;

    #
    # If you use a Mongo database, uncomment this variable and assign to it the
    # name of your database.
    #export DB_NAME='default';

    #
    # If you want to respect all CORS validations, uncomment this variable.
    #export RESPECT_CORS='true';

    #
    # Internal configurations.
    export P_LOG_DIR="logs";
    export PIDS_FILE="$P_LOG_DIR/pids";
fi;

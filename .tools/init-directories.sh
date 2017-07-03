#!/bin/bash
#
echo -e "\e[32mInitializing server's directory:\e[0m";
npm install | awk '{print "\t" $0}';
#
echo -e "\e[32mInitializing client's directory:\e[0m";
cd client;
npm install | awk '{print "\t" $0}';
#

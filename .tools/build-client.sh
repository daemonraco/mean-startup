#!/bin/bash
#
P_NG='./node_modules/.bin/ng';
#
echo -e "\e[32mAccessing client:\e[0m";
cd client;
#
echo -e "\e[32mBuilding for Production:\e[0m";
$P_NG build --prod | awk '{print "\t" $0}';
#
echo -e "\e[32mReturning to server:\e[0m";
cd ..;
#
echo -e "\e[32mCleaning server's public directory:\e[0m";
rm -frv public/* | awk '{print "\t" $0}';
#
echo -e "\e[32mCopying built client:\e[0m";
cp -frv client/dist/* public | awk '{print "\t" $0}';
#

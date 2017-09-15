#!/bin/bash
#
P_DISTDIR="./dist";
#
P_ASSETS=".tools assets configs public routes schemas secure server.js package.json"
#
echo -e "\e[32mReseting distribution directory:\e[0m";
if [ -e "$P_DISTDIR" ]; then
    rm -frv "$P_DISTDIR";
fi | awk '{print "\t" $0}';
mkdir -vp "$P_DISTDIR" | awk '{print "\t" $0}';
#
echo -en "\e[32mDo you want to rebuild the client? (y/N): \e[0m";
read answer;
if [ "$answer" == 'Y' ] || [ "$answer" == 'y' ]; then
    npm run build-client;
fi | awk '{print "\t" $0}';
#
echo -e "\e[32mCopying assets:\e[0m";
cp -fvr $P_ASSETS "$P_DISTDIR" | awk '{print "\t" $0}';
#
echo -e "\e[32mAccessing distribution directory:\e[0m";
cd "$P_DISTDIR";
#
echo -e "\e[32mCreating tarball:\e[0m";
tar cfzv dist.tar.gz * | awk '{print "\t" $0}';
#

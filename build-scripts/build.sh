#!/bin/bash

if [ "$TRAVIS_COMMIT" != "" ]; then
    commit=$(echo "$TRAVIS_COMMIT" | head -c 7);
    branch="$TRAVIS_BRANCH";
    version="$commit ($branch)"
elif [ $(which git) != "" ]; then
    commit=$(git rev-parse HEAD | head -c 7);
    branch=$(git rev-parse --abbrev-ref HEAD);
    version="$commit ($branch) - dev-build"
else
   version="dev-build"
fi

dstArch="$GOARCH"
if [ "$dstArch" = "386" ]; then
    dstArch="i386"
fi

dstName="goosic"
if [ "$GOOS" = "windows" ]; then
    dstName="$dstName.exe"
fi

echo "Building for $GOOS $dstArch - ver. $version"
cd backend
go build -ldflags "-s -w -X 'main.Version=$version'" -o ../dist/$GOOS/$dstArch/$dstName ./cmd/goosic/

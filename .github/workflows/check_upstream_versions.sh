#!/bin/bash

image_arr_sync_ref=`docker image inspect --format '{{index .Config.Labels "arr_sync_ref"}}' ghcr.io/$GITHUB_REPOSITORY`

current_arr_sync_ref=`curl -sX GET "https://api.github.com/repos/sabrsorensen/arr-sync-webhook/commits/master" | jq '.sha' | tr -d '"'`

if [ $image_arr_sync_ref != $current_arr_sync_ref ]
then
    echo "New version of arr-sync-webhook is available."
    build=1
fi

if [[ $build ]]
then
    echo "Triggering build."
    echo "build=true" >> $GITHUB_OUTPUT
else
    echo "No build needed."
    echo "build=false" >> $GITHUB_OUTPUT
fi

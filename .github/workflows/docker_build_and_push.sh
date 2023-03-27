#!/bin/bash

docker buildx build \
    --output "type=image,push=true" \
    --tag ghcr.io/${GITHUB_REPOSITORY}:${GITHUB_REF//refs\/heads\//}-${GITHUB_SHA:0:7} \
    --tag ghcr.io/${GITHUB_REPOSITORY}:latest \
    --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
    --build-arg COMMIT_AUTHOR="$(git log -1 --pretty=format:'%ae')" \
    --build-arg VCS_REF="${GITHUB_SHA}" \
    --build-arg VCS_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}" \
    --build-arg ARR_SYNC_REF="$(curl -sX GET "https://api.github.com/repos/sabrsorensen/arr-sync-webhook/commits/master" | jq '.sha' | tr -d '"')" \
    --file ./Dockerfile ./
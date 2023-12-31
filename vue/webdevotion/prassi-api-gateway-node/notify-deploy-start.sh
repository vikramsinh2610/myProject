#!/bin/bash

# Create a deployment
create_gh_deployment () {
  curl -s -X POST "https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/deployments" \
      -H 'Content-Type: application/json' \
      -H 'Accept: application/vnd.github.ant-man-preview+json' \
      -u ${GITHUB_ACCESS_TOKEN} \
      -d "{"ref": "${CIRCLE_SHA1}", "environment": "staging", "required_contexts": [], "auto_merge": false}"
}

# Run this function when you trigger a deploy.
# Keep track of the deployment id as $gh_deploy_id for later. We're using https://stedolan.github.io/jq/ to parse the JSON to grab the id.
declare -r created_gh_deployment=$(create_gh_deployment)
declare -r gh_deploy_id=$(echo $created_gh_deployment | jq .id)

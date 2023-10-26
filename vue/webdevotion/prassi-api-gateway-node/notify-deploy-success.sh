#!/bin/bash

# Notify GitHub of a successful deployment
notify_gh_about_a_deployment () {
  declare -r deployment_id=${1}
  declare -r deployment_status=${2}
  curl -s -X POST "https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/deployments/${deployment_id}/statuses" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/vnd.github.ant-man-preview+json' \
    -u ${GITHUB_ACCESS_TOKEN} \
    -d "{"state": "${deployment_status}", "log_url": "${CIRCLE_BUILD_URL}"}"
}

# When a deploy is successful:
notify_gh_about_a_deployment $gh_deploy_id "success"

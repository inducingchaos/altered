#!/bin/bash
set -euo pipefail

MAX_ATTEMPTS=12
POLL_INTERVAL=5

extract_http_code() {
    echo "$1" | tail -n1
}

extract_response_body() {
    echo "$1" | sed '$d'
}

fetch_deployments() {
    local api_url="https://api.vercel.com/v6/deployments?teamId=${VERCEL_TEAM}&projectId=${PROJECT_NAME}&target=${DEPLOYMENT_ENVIRONMENT}&limit=10"
    
    curl -s -w "\n%{http_code}" \
        -X GET "$api_url" \
        -H "Authorization: Bearer ${VERCEL_TOKEN}"
}

find_deployment_by_commit() {
    local deployments_json="$1"
    local commit_sha="$2"
    
    local result=""
    
    result=$(echo "$deployments_json" | jq -r \
        --arg sha "$commit_sha" \
        'if type == "object" and has("deployments") then .deployments[] else .[] end | select(.meta.githubCommitSha? == $sha) | .uid' 2>/dev/null | head -n1)
    
    if [ -z "$result" ] || [ "$result" = "null" ]; then
        echo ""
    else
        echo "$result"
    fi
}

get_deployment_details() {
    local deployment_id="$1"
    
    curl -s \
        -X GET "https://api.vercel.com/v13/deployments/${deployment_id}?teamId=${VERCEL_TEAM}" \
        -H "Authorization: Bearer ${VERCEL_TOKEN}"
}

extract_creator_username() {
    local deployment_details="$1"
    
    echo "$deployment_details" | jq -r '.creator.username // empty' 2>/dev/null || echo ""
}

poll_for_deployment() {
    local attempt=0
    local deployment_id=""
    
    while [ $attempt -lt $MAX_ATTEMPTS ] && [ -z "$deployment_id" ]; do
        if [ $attempt -gt 0 ]; then
            echo "[INFO] Waiting for deployment to appear... (attempt $attempt/$MAX_ATTEMPTS)"

            sleep $POLL_INTERVAL
        fi
        
        attempt=$((attempt + 1))
        
        raw_response=$(fetch_deployments)
        http_code=$(extract_http_code "$raw_response")
        deployments_json=$(extract_response_body "$raw_response")
        
        if [ "$http_code" -ne 200 ]; then
            echo "[ERROR] Failed to fetch deployments (HTTP $http_code), will retry..."

            continue
        fi
        
        deployment_id=$(find_deployment_by_commit "$deployments_json" "$COMMIT_SHA")
    done
    
    echo "$deployment_id"
}

echo "[INFO] Finding ${DEPLOYMENT_ENVIRONMENT} deployment for commit ${COMMIT_SHA}..."

deployment_id=$(poll_for_deployment)

if [ -z "$deployment_id" ] || [ "$deployment_id" = "null" ]; then
    echo "[ERROR] Could not find ${DEPLOYMENT_ENVIRONMENT} deployment matching commit ${COMMIT_SHA} after ${MAX_ATTEMPTS} attempts."

    exit 1
fi

echo "[INFO] Found deployment: $deployment_id"

deployment_details=$(get_deployment_details "$deployment_id")
creator_username=$(extract_creator_username "$deployment_details")

echo "deployment-id=${deployment_id}" >> $GITHUB_OUTPUT
echo "deployment-creator-username=${creator_username}" >> $GITHUB_OUTPUT

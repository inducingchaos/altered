#!/bin/bash
set -euo pipefail

extract_http_code() {
    echo "$1" | tail -n1
}

extract_response_body() {
    echo "$1" | sed '$d'
}

extract_json_field() {
    local json="$1"
    local field="$2"
    
    echo "$json" | jq -r "$field // empty" 2>/dev/null || \
    echo "$json" | grep -o "\"${field}\":\"[^\"]*" | head -1 | cut -d'"' -f4
}

make_deployment_request() {
    local api_url="https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM}"
    local payload=$(jq -n \
        --arg name "$PROJECT_NAME" \
        --arg repo_id "$REPO_ID" \
        --arg ref "$REF" \
        --arg sha "$COMMIT_SHA" \
        '{
            name: $name,
            gitSource: {
                type: "github",
                repoId: $repo_id,
                ref: $ref,
                sha: $sha
            }
        }')
    
    curl -s -w "\n%{http_code}" \
        -X POST "$api_url" \
        -H "Authorization: Bearer ${VERCEL_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "$payload"
}

validate_response() {
    local http_code="$1"
    local body="$2"
    
    if [ "$http_code" -ne 200 ] && [ "$http_code" -ne 201 ]; then
        echo "[ERROR] Deployment failed: HTTP $http_code"
        echo "[ERROR] Deployment response: $body"
        exit 1
    fi
}

echo "[INFO] Creating deployment..."

raw_response=$(make_deployment_request)
http_code=$(extract_http_code "$raw_response")
response_body=$(extract_response_body "$raw_response")

validate_response "$http_code" "$response_body"

deployment_id=$(extract_json_field "$response_body" ".id")
creator_username=$(extract_json_field "$response_body" ".creator.username")

if [ -z "$deployment_id" ]; then
    echo "[ERROR] Could not extract deployment ID from response."
    exit 1
fi

echo "[INFO] Deployment created: $deployment_id"

echo "deployment-id=${deployment_id}" >> $GITHUB_OUTPUT
echo "deployment-creator-username=${creator_username}" >> $GITHUB_OUTPUT

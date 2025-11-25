#!/bin/bash
set -euo pipefail

extract_http_code() {
    echo "$1" | tail -n1
}

extract_response_body() {
    echo "$1" | sed '$d'
}

fetch_deployment_status() {
    local deployment_id="$1"
    local vercel_team="$2"
    local vercel_token="$3"
    
    curl -s -w "\n%{http_code}" \
        -X GET "https://api.vercel.com/v13/deployments/${deployment_id}?teamId=${vercel_team}" \
        -H "Authorization: Bearer ${vercel_token}"
}

extract_ready_state() {
    local response_body="$1"
    
    echo "$response_body" | grep -o '"readyState":"[^"]*' | head -1 | cut -d'"' -f4
}

extract_inspector_url() {
    local response_body="$1"
    
    echo "$response_body" | grep -o '"inspectorUrl":"[^"]*' | head -1 | cut -d'"' -f4
}

poll_deployment_status() {
    local deployment_id="$1"
    local vercel_team="$2"
    local vercel_token="$3"
    local max_attempts="${4:-60}"
    local poll_interval="${5:-5}"
    
    local attempt=0
    local ready_state=""
    local inspector_url=""
    local final_state=""
    local final_inspector_url=""
    
    while [ $attempt -lt $max_attempts ]; do
        sleep $poll_interval
        attempt=$((attempt + 1))
        
        raw_response=$(fetch_deployment_status "$deployment_id" "$vercel_team" "$vercel_token")
        http_code=$(extract_http_code "$raw_response")
        response_body=$(extract_response_body "$raw_response")
        
        if [ "$http_code" -ne 200 ]; then
            echo "[ERROR] Failed to fetch deployment status (HTTP $http_code), will retry..." >&2
            continue
        fi
        
        ready_state=$(extract_ready_state "$response_body")
        inspector_url=$(extract_inspector_url "$response_body")
        
        printf "[INFO] Status: <%s> (Attempt %d/%d)\n" "$ready_state" "$attempt" "$max_attempts" >&2
        
        if [ "$ready_state" = "READY" ]; then
            echo "[INFO] Deployment is ready! Inspector URL: $inspector_url" >&2
            echo "READY|$inspector_url"

            return 0
        elif [ "$ready_state" = "ERROR" ] || [ "$ready_state" = "CANCELED" ]; then
            echo "[ERROR] Deployment failed with state: $ready_state" >&2
            echo "${ready_state}|${inspector_url}"
            
            return 1
        fi
        
        final_state="$ready_state"
        final_inspector_url="$inspector_url"
    done
    
    echo "[ERROR] Deployment did not become ready within timeout." >&2
    if [ -n "$final_inspector_url" ]; then
        echo "${final_state}|${final_inspector_url}"
    else
        echo "TIMEOUT|https://vercel.com/${vercel_team}/riley-barabash/${deployment_id}"
    fi
    return 2
}
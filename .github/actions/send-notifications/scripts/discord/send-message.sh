#!/bin/bash
set -euo pipefail

extract_http_code() {
    echo "$1" | tail -n1
}

extract_response_body() {
    echo "$1" | sed '$d'
}

add_webhook_params() {
    local webhook_url="$1"
    
    if [[ "$webhook_url" != *"?"* ]]; then
        echo "${webhook_url}?wait=true&with_components=true"
    else
        local result="$webhook_url"
        if [[ "$result" != *"wait=true"* ]]; then
            result="${result}&wait=true"
        fi
        if [[ "$result" != *"with_components=true"* ]]; then
            result="${result}&with_components=true"
        fi
        echo "$result"
    fi
}

send_discord_message() {
    local webhook_url="$1"
    local payload="$2"
    local notification_ids_file="$3"
    
    if [ -z "$webhook_url" ]; then
        echo "[ERROR] DISCORD_WEBHOOK_URL not set, skipping notification."
        return 1
    fi
    
    local webhook_url_with_params=$(add_webhook_params "$webhook_url")
    
    local response=$(curl -s -w "\n%{http_code}" \
        -X POST "$webhook_url_with_params" \
        -H "Content-Type: application/json" \
        -d "$payload" 2>&1) || true
    
    local http_code=$(extract_http_code "$response")
    local response_body=$(extract_response_body "$response")
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "204" ]; then
        if [ -n "$response_body" ] && [ ${#response_body} -gt 0 ]; then
            local message_id=$(echo "$response_body" | jq -r '.id // empty' 2>/dev/null || echo "")

            if [ -n "$message_id" ] && [ "$message_id" != "null" ] && [ "$message_id" != "" ]; then
                echo "$message_id" >> "$notification_ids_file"

                echo "[INFO] Discord notification sent (Message ID: $message_id)"
                echo "[INFO] Cached notification ID: $message_id"

                return 0
            else
                echo "[ERROR] Discord notification sent (HTTP $http_code) but couldn't extract message ID from response body."

                return 0
            fi
        else
            echo "[ERROR] Discord notification sent (HTTP $http_code) but response body is empty - no message ID to cache."
            
            return 0
        fi
    else
        echo "[ERROR] Discord notification may have failed (HTTP $http_code)."
        echo "[ERROR] Discord notification response: $response_body"

        return 1
    fi
}


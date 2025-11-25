#!/bin/bash

extract_http_code() {
    echo "$1" | tail -n1
}

is_valid_message_id() {
    local message_id="$1"
    [ -n "$message_id" ] && [ "$message_id" != "" ]
}

delete_discord_message() {
    local webhook_url="$1"
    local message_id="$2"
    
    echo "[INFO] Deleting message: $message_id"
    
    local response=$(curl -s -w "\n%{http_code}" \
        -X DELETE "${webhook_url}/messages/${message_id}" 2>&1) || true
    
    local http_code=$(extract_http_code "$response")
    
    if [ "$http_code" = "204" ]; then
        echo "[INFO] Deleted message: $message_id"
        return 0
    elif [ "$http_code" = "404" ]; then
        echo "[INFO] Message $message_id not found (already deleted). Continuing."
        return 0
    else
        echo "[WARN] Failed to delete message $message_id (HTTP $http_code). Will continue anyway."
        return 0
    fi
}

has_cached_messages() {
    local notification_ids_file="$1"
    [ -f "$notification_ids_file" ] && [ -s "$notification_ids_file" ]
}

clear_notification_ids_file() {
    local notification_ids_file="$1"
    > "$notification_ids_file"
}

delete_cached_messages() {
    local notification_ids_file="$1"
    local webhook_url="${DISCORD_WEBHOOK_URL:-}"
    
    if [ -z "$webhook_url" ]; then
        return
    fi
    
    if ! has_cached_messages "$notification_ids_file"; then
        echo "[INFO] No cached Discord messages to delete."
        return
    fi
    
    echo "[INFO] Deleting cached Discord messages..."
    
    set +e
    while IFS= read -r message_id || [ -n "$message_id" ]; do
        message_id=$(echo "$message_id" | xargs)
        
        if is_valid_message_id "$message_id"; then
            delete_discord_message "$webhook_url" "$message_id" || true
        fi
    done < "$notification_ids_file"
    set -e
    
    clear_notification_ids_file "$notification_ids_file"
}

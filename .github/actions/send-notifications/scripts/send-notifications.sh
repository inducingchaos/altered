#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/discord/delete-messages.sh"
source "${SCRIPT_DIR}/get-deployment-status.sh"
source "${SCRIPT_DIR}/discord/create-embed.sh"
source "${SCRIPT_DIR}/discord/send-message.sh"

NOTIFICATION_IDS_FILE="notification-ids.${DEPLOYMENT_ENVIRONMENT}"
export NOTIFICATION_IDS_FILE

cleanup() {
    touch "$NOTIFICATION_IDS_FILE"
}

trap cleanup EXIT

touch "$NOTIFICATION_IDS_FILE"

if [ -f "$NOTIFICATION_IDS_FILE" ] && [ -s "$NOTIFICATION_IDS_FILE" ]; then
    echo "[INFO] Cache restored - found $(wc -l < "$NOTIFICATION_IDS_FILE") notification ID(s)."
    echo "[INFO] Cached notification IDs:"
    cat "$NOTIFICATION_IDS_FILE"
else
    echo "[INFO] No cache found or cache file is empty."
fi

delete_cached_messages "$NOTIFICATION_IDS_FILE"

if [ -z "${DISCORD_WEBHOOK_URL:-}" ]; then
    echo "[ERROR] DISCORD_WEBHOOK_URL not set, skipping notifications."
    exit 0
fi

if [ -z "${DEPLOYMENT_ENVIRONMENT:-}" ]; then
    echo "[ERROR] DEPLOYMENT_ENVIRONMENT not set, skipping notifications."
    exit 0
fi

echo "[INFO] Sending initial BUILDING notification..."

initial_inspector_url="https://vercel.com/${VERCEL_TEAM}/riley-barabash/${DEPLOYMENT_ID}"
initial_payload=$(build_embed_payload \
    "BUILDING" \
    "$initial_inspector_url" \
    "$DEPLOYMENT_ENVIRONMENT" \
    "$REPO" \
    "$BRANCH_NAME" \
    "$COMMIT_SHA" \
    "$COMMIT_MSG" \
    "$DEPLOYMENT_CREATOR_USERNAME")

send_discord_message "$DISCORD_WEBHOOK_URL" "$initial_payload" "$NOTIFICATION_IDS_FILE"

set +e
poll_result=$(poll_deployment_status "$DEPLOYMENT_ID" "$VERCEL_TEAM" "$VERCEL_TOKEN")
poll_exit_code=$?
set -e

if [ -z "$poll_result" ]; then
    echo "[ERROR] Failed to get deployment status result."
    
    exit 1
fi

final_status=$(echo "$poll_result" | cut -d'|' -f1)
inspector_url=$(echo "$poll_result" | cut -d'|' -f2)

if [ -z "$inspector_url" ] || [[ ! "$inspector_url" =~ ^https:// ]]; then
    inspector_url="https://vercel.com/${VERCEL_TEAM}/riley-barabash/${DEPLOYMENT_ID}"
fi

delete_cached_messages "$NOTIFICATION_IDS_FILE"

final_payload=$(build_embed_payload \
    "$final_status" \
    "$inspector_url" \
    "$DEPLOYMENT_ENVIRONMENT" \
    "$REPO" \
    "$BRANCH_NAME" \
    "$COMMIT_SHA" \
    "$COMMIT_MSG" \
    "$DEPLOYMENT_CREATOR_USERNAME")

send_discord_message "$DISCORD_WEBHOOK_URL" "$final_payload" "$NOTIFICATION_IDS_FILE"

if [ "$final_status" != "READY" ]; then
    exit 1
fi

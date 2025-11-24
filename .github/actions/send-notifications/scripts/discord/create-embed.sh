#!/bin/bash
set -euo pipefail

get_discord_color() {
    local status_state="$1"
    case "${status_state}" in
        "READY")
            echo "5301186"
            ;;
        "BUILDING")
            echo "16098851"
            ;;
        "ERROR"|"CANCELED")
            echo "16711680"
            ;;
        "QUEUED"|"INITIALIZING")
            echo "3355443"
            ;;
        *)
            echo "3355443"
            ;;
    esac
}

format_status_display() {
    local status_state="$1"
    echo "\`${status_state}\`"
}

extract_commit_title() {
    local commit_msg="$1"
    echo "$commit_msg" | head -n1
}

extract_commit_body() {
    local commit_msg="$1"
    echo "$commit_msg" | tail -n +2 | sed '/^$/d' | tr '\n' ' ' | head -c 1000
}

truncate_title() {
    local title="$1"
    local max_length="${2:-100}"
    
    if [ ${#title} -gt $max_length ]; then
        echo "${title:0:$max_length}..."
    else
        echo "$title"
    fi
}

build_deployment_config() {
    local deployment_environment="$1"
    
    if [ "$deployment_environment" = "production" ]; then
        echo "https://altered.app|[PRODUCTION] |Deployment created for commit|false"
    else
        echo "https://preview.altered.app|[PREVIEW] |Deployment created for commit|true"
    fi
}

build_embed_payload() {
    local status_state="$1"
    local inspector_url="$2"
    local deployment_environment="$3"
    local repo="$4"
    local branch_name="$5"
    local commit_sha="$6"
    local commit_msg="$7"
    local creator_username="$8"
    
    local config=$(build_deployment_config "$deployment_environment")
    local deployment_url=$(echo "$config" | cut -d'|' -f1)
    local title_prefix=$(echo "$config" | cut -d'|' -f2)
    local description_template=$(echo "$config" | cut -d'|' -f3)
    local show_pr_button=$(echo "$config" | cut -d'|' -f4)
    
    local commit_title=$(extract_commit_title "$commit_msg")
    local commit_title_truncated=$(truncate_title "$commit_title")
    local commit_body=$(extract_commit_body "$commit_msg")
    
    local commit_link="https://github.com/${repo}/commit/${commit_sha}"
    local branch_link="https://github.com/${repo}/tree/${branch_name}"
    
    local description=""
    if [ "$deployment_environment" = "production" ]; then
        description="${description_template} [\`${commit_title_truncated}\`](${commit_link})."
    else
        description="${description_template} [\`${commit_title_truncated}\`](${commit_link}) on branch [\`${branch_name}\`](${branch_link})."
    fi
    
    local status_display=$(format_status_display "$status_state")
    local color=$(get_discord_color "$status_state")
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    local footer_icon=""
    if [ -n "$creator_username" ] && [ "$creator_username" != "null" ] && [ "$creator_username" != "" ]; then
        footer_icon="https://github.com/${creator_username}.png"
    fi
    
    local fields_base=$(jq -n \
        --arg deployment_url "$deployment_url" \
        --arg inspector_url "$inspector_url" \
        --arg status_display "$status_display" \
        '[
            { name: "URL", value: $deployment_url, inline: true },
            { name: "Inspect", value: "[View Deployment](\($inspector_url))", inline: true },
            { name: "Status", value: $status_display, inline: true }
        ]')
    
    local fields="$fields_base"
    if [ -n "$commit_body" ] && [ ${#commit_body} -gt 0 ]; then
        fields=$(echo "$fields_base" | jq --arg body "$commit_body" '. + [{ name: "Commit Details", value: $body, inline: false }]')
    fi
    
    if [ "$show_pr_button" = "true" ]; then
        local pr_url="https://github.com/${repo}/compare/main...${branch_name}"
        jq -n \
            --arg title "${title_prefix}Deployment Created" \
            --arg description "$description" \
            --argjson color "$color" \
            --argjson fields "$fields" \
            --arg creator_username "$creator_username" \
            --arg footer_icon "$footer_icon" \
            --arg timestamp "$timestamp" \
            --arg pr_url "$pr_url" \
            '{
                embeds: [{
                    title: $title,
                    description: $description,
                    color: $color,
                    fields: $fields,
                    footer: {
                        text: "Authored by @\($creator_username)",
                        icon_url: (if ($footer_icon | length) > 0 then $footer_icon else empty end)
                    },
                    timestamp: $timestamp
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 5,
                        label: "Create Pull Request",
                        url: $pr_url
                    }]
                }]
            }'
    else
        jq -n \
            --arg title "${title_prefix}Deployment Created" \
            --arg description "$description" \
            --argjson color "$color" \
            --argjson fields "$fields" \
            --arg creator_username "$creator_username" \
            --arg footer_icon "$footer_icon" \
            --arg timestamp "$timestamp" \
            '{
                embeds: [{
                    title: $title,
                    description: $description,
                    color: $color,
                    fields: $fields,
                    footer: {
                        text: "Authored by @\($creator_username)",
                        icon_url: (if ($footer_icon | length) > 0 then $footer_icon else empty end)
                    },
                    timestamp: $timestamp
                }]
            }'
    fi
}


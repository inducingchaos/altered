/**
 *
 */

import { List } from "@raycast/api"

import { Thought } from "@altered/db/schema"

import { prettifyDate } from "../../../../utils"
import { ThoughtListItemActions } from "./actions"

export function ThoughtListItem({
    thought,
    handleRefresh,
    handleDelete,
    isShowingDetail,
    toggleDetail
}: {
    thought: Thought
    handleRefresh: () => unknown
    handleDelete: (thought: Thought) => unknown
    isShowingDetail: boolean
    toggleDetail: () => unknown
}) {
    return (
        <List.Item
            key={thought.id}
            title={thought.content}
            detail={
                <List.Item.Detail
                    markdown={thought.content}
                    metadata={
                        <List.Item.Detail.Metadata>
                            <List.Item.Detail.Metadata.Label title="Created" text={prettifyDate(thought.createdAt)} />
                        </List.Item.Detail.Metadata>
                    }
                />
            }
            actions={
                <ThoughtListItemActions
                    thought={thought}
                    handleRefresh={handleRefresh}
                    handleDelete={handleDelete}
                    isShowingDetail={isShowingDetail}
                    toggleDetail={toggleDetail}
                />
            }
            accessories={[
                {
                    date: thought.createdAt
                }
            ]}
        />
    )
}

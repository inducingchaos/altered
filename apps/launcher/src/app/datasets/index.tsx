/**
 *
 */

import { List } from "@raycast/api"

import { prettifyDate } from "../../utils"

export default function Datasets() {
    return (
        <List>
            <List.Item
                title="App Features"
                subtitle="31 Thoughts"
                accessories={[{ text: prettifyDate(new Date("2004-04-30")) }]}
            />
        </List>
    )
}

/**
 *
 */

import { Form } from "@raycast/api"

export default function Settings() {
    return (
        <Form>
            <Form.Checkbox id="auto-upload-voice-captures" label="Auto-Upload Voice Captures" defaultValue={true} />
        </Form>
    )
}

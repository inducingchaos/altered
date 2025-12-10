import { Tool } from "@raycast/api"

type Input = {
    /** The description for the input property */
    query: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function (_input: Input) {
    // Your tool code here
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const confirmation: Tool.Confirmation<Input> = async _input => {
    return {
        message: "Run Tool"
    }
}

// /**
//  *
//  */

// import { useState } from "react"
// import { Action, ActionPanel, Clipboard, Color, Grid, Icon, List, showToast, Toast } from "@raycast/api"

// import { ContextProvider } from "../../components/ui/headless/context-providers"
// import { Tool } from "../../types/tools"

// /**
//  * Mock data for thought management commands
//  */
// const THOUGHT_COMMANDS: Tool[] = [
//     // Create

//     // Capture Text
//     // Capture Voice
//     // Capture Selection
//     // Capture Clipboard
//     // Capture & Input Commands
//     {
//         id: "capture-text",
//         title: "Capture Text Thought",
//         description: "Quickly capture a text-based thought or idea",
//         icon: Icon.Text,
//         color: Color.SecondaryText,
//         category: "Capture",
//         filterType: "Thought",
//         keywords: ["text", "note", "idea", "capture", "write"],
//         action: () => showToast(Toast.Style.Success, "Opening text capture...")
//     },
//     {
//         id: "capture-voice",
//         title: "Capture Voice Thought",
//         description: "Record your thoughts using voice input",
//         icon: Icon.Microphone,
//         color: Color.SecondaryText,
//         category: "Capture",
//         filterType: "Thought",
//         keywords: ["voice", "audio", "record", "speak", "capture"],
//         action: () => showToast(Toast.Style.Success, "Opening voice capture...")
//     },
//     {
//         id: "capture-image",
//         title: "Capture Image Thought",
//         description: "Capture thoughts from images or screenshots",
//         icon: Icon.Camera,
//         color: Color.SecondaryText,
//         category: "Capture",
//         filterType: "Dataset",
//         keywords: ["image", "photo", "screenshot", "visual", "capture"],
//         action: () => showToast(Toast.Style.Success, "Opening image capture...")
//     },
//     {
//         id: "capture-url",
//         title: "Capture URL Thought",
//         description: "Save web content as a thought",
//         icon: Icon.Link,
//         color: Color.SecondaryText,
//         category: "Capture",
//         filterType: "Dataset",
//         keywords: ["url", "web", "link", "bookmark", "capture"],
//         action: () => showToast(Toast.Style.Success, "Opening URL capture...")
//     },

//     // Organization & Management Commands
//     {
//         id: "organize-thoughts",
//         title: "Organize Thoughts",
//         description: "Sort and categorize your thoughts by topic",
//         icon: Icon.Folder,
//         color: Color.SecondaryText,
//         category: "Organization",
//         filterType: "Thought",
//         keywords: ["organize", "sort", "categorize", "folder", "structure"],
//         action: () => showToast(Toast.Style.Success, "Opening thought organization...")
//     },
//     {
//         id: "search-thoughts",
//         title: "Search Thoughts",
//         description: "Find specific thoughts across your brain",
//         icon: Icon.MagnifyingGlass,
//         color: Color.SecondaryText,
//         category: "Organization",
//         filterType: "Dataset",
//         keywords: ["search", "find", "query", "lookup", "discover"],
//         action: () => showToast(Toast.Style.Success, "Opening thought search...")
//     },
//     {
//         id: "tag-thoughts",
//         title: "Tag Thoughts",
//         description: "Add or edit tags for better organization",
//         icon: Icon.Tag,
//         color: Color.SecondaryText,
//         category: "Organization",
//         filterType: "Thought",
//         keywords: ["tag", "label", "categorize", "organize", "metadata"],
//         action: () => showToast(Toast.Style.Success, "Opening tag management...")
//     },
//     {
//         id: "merge-thoughts",
//         title: "Merge Thoughts",
//         description: "Combine related thoughts into one",
//         icon: Icon.TwoArrowsClockwise,
//         color: Color.SecondaryText,
//         category: "Organization",
//         filterType: "Dataset",
//         keywords: ["merge", "combine", "consolidate", "unite", "join"],
//         action: () => showToast(Toast.Style.Success, "Opening thought merger...")
//     },

//     // AI & Intelligence Commands
//     {
//         id: "ai-analyze",
//         title: "AI Analysis",
//         description: "Get AI insights about your thoughts",
//         icon: Icon.Circle,
//         color: Color.SecondaryText,
//         category: "AI & Intelligence",
//         filterType: "Thought",
//         keywords: ["ai", "analysis", "insights", "intelligence", "brain"],
//         action: () => showToast(Toast.Style.Success, "Opening AI analysis...")
//     },
//     {
//         id: "ai-suggest",
//         title: "AI Suggestions",
//         description: "Get AI-powered thought suggestions",
//         icon: Icon.LightBulb,
//         color: Color.SecondaryText,
//         category: "AI & Intelligence",
//         filterType: "Dataset",
//         keywords: ["ai", "suggestions", "ideas", "recommendations", "inspiration"],
//         action: () => showToast(Toast.Style.Success, "Opening AI suggestions...")
//     },
//     {
//         id: "ai-summarize",
//         title: "AI Summarize",
//         description: "Summarize long thoughts with AI",
//         icon: Icon.Document,
//         color: Color.SecondaryText,
//         category: "AI & Intelligence",
//         filterType: "Thought",
//         keywords: ["ai", "summarize", "condense", "extract", "key points"],
//         action: () => showToast(Toast.Style.Success, "Opening AI summarization...")
//     },
//     {
//         id: "ai-connect",
//         title: "AI Connections",
//         description: "Find AI-discovered connections between thoughts",
//         icon: Icon.Network,
//         color: Color.SecondaryText,
//         category: "AI & Intelligence",
//         filterType: "Dataset",
//         keywords: ["ai", "connections", "relationships", "patterns", "insights"],
//         action: () => showToast(Toast.Style.Success, "Opening AI connections...")
//     },

//     // Export & Sharing Commands
//     {
//         id: "export-thoughts",
//         title: "Export Thoughts",
//         description: "Export your thoughts in various formats",
//         icon: Icon.Download,
//         color: Color.SecondaryText,
//         category: "Export & Sharing",
//         filterType: "Thought",
//         keywords: ["export", "download", "backup", "save", "format"],
//         action: () => showToast(Toast.Style.Success, "Opening export options...")
//     },
//     {
//         id: "share-thoughts",
//         title: "Share Thoughts",
//         description: "Share thoughts with others",
//         icon: Icon.Link,
//         color: Color.SecondaryText,
//         category: "Export & Sharing",
//         filterType: "Dataset",
//         keywords: ["share", "collaborate", "send", "publish", "distribute"],
//         action: () => showToast(Toast.Style.Success, "Opening share options...")
//     },
//     {
//         id: "sync-thoughts",
//         title: "Sync Thoughts",
//         description: "Synchronize thoughts across devices",
//         icon: Icon.ArrowClockwise,
//         color: Color.SecondaryText,
//         category: "Export & Sharing",
//         filterType: "Thought",
//         keywords: ["sync", "synchronize", "cloud", "backup", "devices"],
//         action: () => showToast(Toast.Style.Success, "Opening sync options...")
//     },
//     {
//         id: "backup-thoughts",
//         title: "Backup Thoughts",
//         description: "Create secure backups of your thought database",
//         icon: Icon.Shield,
//         color: Color.SecondaryText,
//         category: "Export & Sharing",
//         filterType: "Dataset",
//         keywords: ["backup", "security", "protect", "save", "recovery"],
//         action: () => showToast(Toast.Style.Success, "Opening backup options...")
//     },

//     // Settings & Configuration Commands
//     {
//         id: "preferences",
//         title: "Preferences",
//         description: "Customize your thought management experience",
//         icon: Icon.Gear,
//         color: Color.SecondaryText,
//         category: "Settings",
//         filterType: "Thought",
//         keywords: ["preferences", "settings", "customize", "configure", "options"],
//         action: () => showToast(Toast.Style.Success, "Opening preferences...")
//     },
//     {
//         id: "keyboard-shortcuts",
//         title: "Keyboard Shortcuts",
//         description: "View and customize keyboard shortcuts",
//         icon: Icon.Keyboard,
//         color: Color.SecondaryText,
//         category: "Settings",
//         filterType: "Dataset",
//         keywords: ["shortcuts", "keyboard", "hotkeys", "commands", "efficiency"],
//         action: () => showToast(Toast.Style.Success, "Opening keyboard shortcuts...")
//     },
//     {
//         id: "themes",
//         title: "Themes",
//         description: "Change the visual appearance of your brain",
//         icon: Icon.Circle,
//         color: Color.SecondaryText,
//         category: "Settings",
//         filterType: "Thought",
//         keywords: ["themes", "appearance", "colors", "visual", "customize"],
//         action: () => showToast(Toast.Style.Success, "Opening theme options...")
//     },
//     {
//         id: "data-management",
//         title: "Data Management",
//         description: "Manage your thought database and storage",
//         icon: Icon.Folder,
//         color: Color.SecondaryText,
//         category: "Settings",
//         filterType: "Dataset",
//         keywords: ["data", "database", "storage", "management", "cleanup"],
//         action: () => showToast(Toast.Style.Success, "Opening data management...")
//     }
// ]

// /**
//  * Group commands by category for organized display
//  */
// function groupCommandsByCategory(commands: ToolCommand[]) {
//     return commands.reduce(
//         (groups, command) => {
//             const category = command.category
//             if (!groups[category]) {
//                 groups[category] = []
//             }
//             groups[category].push(command)
//             return groups
//         },
//         {} as Record<string, ToolCommand[]>
//     )
// }

// /**
//  * Main Command Palette component
//  */
// function CommandPalette() {
//     const [searchText, setSearchText] = useState("")
//     const [filterType, setFilterType] = useState<"Thought" | "Dataset" | "All">("All")

//     // Filter commands based on search text and filter type
//     const filteredCommands = THOUGHT_COMMANDS.filter(
//         command =>
//             (filterType === "All" || command.filterType === filterType) &&
//             (command.title.toLowerCase().includes(searchText.toLowerCase()) ||
//                 command.description.toLowerCase().includes(searchText.toLowerCase()) ||
//                 command.keywords.some(keyword => keyword.toLowerCase().includes(searchText.toLowerCase())))
//     )

//     const filteredGroupedCommands = groupCommandsByCategory(filteredCommands)

//     return (
//         <List
//             searchBarPlaceholder="Search thought management commands..."
//             searchText={searchText}
//             onSearchTextChange={setSearchText}
//             isShowingDetail={false}
//             searchBarAccessory={
//                 <List.Dropdown
//                     tooltip="Filter by Type"
//                     value={filterType}
//                     onChange={value => setFilterType(value as "Thought" | "Dataset" | "All")}
//                 >
//                     <List.Dropdown.Item title="All Types" value="All" />
//                     <List.Dropdown.Item title="Thought Commands" value="Thought" />
//                     <List.Dropdown.Item title="Dataset Commands" value="Dataset" />
//                 </List.Dropdown>
//             }
//         >
//             {filteredCommands.length === 0 ? (
//                 <List.EmptyView
//                     icon={{ source: Icon.MagnifyingGlass, tintColor: Color.SecondaryText }}
//                     title="No commands found"
//                     description={`No commands match "${searchText}" in ${filterType === "All" ? "all types" : filterType + " commands"}`}
//                 />
//             ) : (
//                 Object.entries(filteredGroupedCommands).map(([category, commands]) => (
//                     <List.Section key={category} title={category} subtitle={`${commands.length} commands`}>
//                         {commands.map(command => (
//                             <List.Item
//                                 key={command.id}
//                                 title={command.title}
//                                 subtitle={command.description}
//                                 icon={{ source: command.icon, tintColor: command.color ?? Color.SecondaryText }}
//                                 keywords={command.keywords}
//                                 actions={
//                                     <ActionPanel>
//                                         <Action
//                                             title={`Execute ${command.title}`}
//                                             icon={command.icon}
//                                             onAction={command.action}
//                                         />
//                                         <Action
//                                             title="Copy Command ID"
//                                             icon={Icon.CopyClipboard}
//                                             onAction={() => {
//                                                 Clipboard.copy(command.id)
//                                                 showToast(Toast.Style.Success, "Command ID copied to clipboard")
//                                             }}
//                                         />
//                                     </ActionPanel>
//                                 }
//                             />
//                         ))}
//                     </List.Section>
//                 ))
//             )}
//         </List>
//     )
// }

// /**
//  * Grid view alternative for the Command Palette
//  */
// function CommandPaletteGrid() {
//     const [searchText, setSearchText] = useState("")
//     const [filterType, setFilterType] = useState<"Thought" | "Dataset" | "All">("All")

//     // Filter commands based on search text and filter type
//     const filteredCommands = THOUGHT_COMMANDS.filter(
//         command =>
//             (filterType === "All" || command.filterType === filterType) &&
//             (command.title.toLowerCase().includes(searchText.toLowerCase()) ||
//                 command.description.toLowerCase().includes(searchText.toLowerCase()) ||
//                 command.keywords.some(keyword => keyword.toLowerCase().includes(searchText.toLowerCase())))
//     )

//     return (
//         <Grid
//             searchBarPlaceholder="Search thought management commands..."
//             searchText={searchText}
//             onSearchTextChange={setSearchText}
//             columns={8}
//             inset={Grid.Inset.Large}
//             navigationTitle="ALTERED Command Palette"
//             searchBarAccessory={
//                 <Grid.Dropdown
//                     tooltip="Filter by Type"
//                     value={filterType}
//                     onChange={value => setFilterType(value as "Thought" | "Dataset" | "All")}
//                 >
//                     <Grid.Dropdown.Item title="All Types" value="All" />
//                     <Grid.Dropdown.Item title="Thought Commands" value="Thought" />
//                     <Grid.Dropdown.Item title="Dataset Commands" value="Dataset" />
//                 </Grid.Dropdown>
//             }
//         >
//             {filteredCommands.length === 0 ? (
//                 <Grid.EmptyView
//                     icon={{ source: Icon.MagnifyingGlass, tintColor: Color.SecondaryText }}
//                     title="No commands found"
//                     description={`No commands match "${searchText}" in ${filterType === "All" ? "all types" : filterType + " commands"}`}
//                 />
//             ) : (
//                 Object.entries(groupCommandsByCategory(filteredCommands)).map(([category, commands]) => (
//                     <Grid.Section key={category} title={category} subtitle={`${commands.length} commands`}>
//                         {commands.map(command => (
//                             <Grid.Item
//                                 key={command.id}
//                                 title={command.title}
//                                 subtitle={command.description}
//                                 content={{ source: command.icon, tintColor: command.color ?? Color.SecondaryText }}
//                                 keywords={command.keywords}
//                                 actions={
//                                     <ActionPanel>
//                                         <Action
//                                             title={`Execute ${command.title}`}
//                                             icon={command.icon}
//                                             onAction={command.action}
//                                         />
//                                         <Action
//                                             title="Copy Command ID"
//                                             icon={Icon.CopyClipboard}
//                                             onAction={() => {
//                                                 Clipboard.copy(command.id)
//                                                 showToast(Toast.Style.Success, "Command ID copied to clipboard")
//                                             }}
//                                         />
//                                     </ActionPanel>
//                                 }
//                             />
//                         ))}
//                     </Grid.Section>
//                 ))
//             )}
//         </Grid>
//     )
// }

// /**
//  * Main export with context provider
//  */
// export function CommandPaletteWithContext() {
//     return (
//         <ContextProvider>
//             <CommandPalette />
//         </ContextProvider>
//     )
// }

// /**
//  * Grid view export with context provider
//  */
// export default function CommandPaletteGridWithContext() {
//     return (
//         <ContextProvider>
//             <CommandPaletteGrid />
//         </ContextProvider>
//     )
// }

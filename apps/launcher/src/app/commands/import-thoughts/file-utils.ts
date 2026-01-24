/**
 *
 */

import { readdir, readFile, stat } from "node:fs/promises"
import { basename, extname, join } from "node:path"
import { configureLogger } from "~/observability"

const logger = configureLogger({
    defaults: { scope: "file-utils" }
})

/**
 * File types that can safely be read as text content.
 */
const SUPPORTED_FILE_EXTENSIONS = new Set([".txt", ".md", ".markdown", ".mdc"])

/**
 * Filenames that should be completely ignored during file operations.
 */
const IGNORED_FILENAMES = new Set([".DS_Store"])

export function isSupportedFileExtension(extension: string): boolean {
    return SUPPORTED_FILE_EXTENSIONS.has(extension.toLowerCase())
}

export function isIgnoredFile(filePath: string): boolean {
    const filename = basename(filePath)

    return IGNORED_FILENAMES.has(filename)
}

/**
 * Gets the file extension, including the dot (e.g., ".txt").
 */
export function getFileExtension(filePath: string): string {
    return extname(filePath)
}

export function getFilenameWithoutExtension(filePath: string): string {
    const fileName = basename(filePath)

    const extension = extname(fileName)
    const filenameWithoutExtension = fileName.slice(0, -extension.length)

    return filenameWithoutExtension
}

export type FileMetadata = {
    createdAt: Date
    modifiedAt: Date
}

export async function getFileMetadata(filePath: string): Promise<FileMetadata> {
    const stats = await stat(filePath)

    return {
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
    }
}

/**
 * Reads the content of a text file.
 *
 * @throws If the file cannot be read, or is not valid UTF-8.
 */
export async function readTextFile(filePath: string): Promise<string> {
    return await readFile(filePath, "utf-8")
}

export async function isDirectory(path: string): Promise<boolean> {
    try {
        return (await stat(path)).isDirectory()
    } catch {
        return false
    }
}

export async function isFile(path: string): Promise<boolean> {
    try {
        return (await stat(path)).isFile()
    } catch {
        return false
    }
}

export async function introspectDirectory(
    path: string,
    options?: { recursively?: boolean }
): Promise<string[]> {
    const { recursively = true } = options ?? {}

    async function traverseDirectory(currentPath: string): Promise<string[]> {
        const filePaths: string[] = []

        try {
            const dirEntries = await readdir(currentPath, {
                withFileTypes: true
            })

            const promises = dirEntries.map(async dirEntry => {
                const fullPath = join(currentPath, dirEntry.name)

                if (dirEntry.isDirectory() && recursively) {
                    const subDirPaths = await traverseDirectory(fullPath)

                    return subDirPaths
                }

                if (dirEntry.isFile()) {
                    if (isIgnoredFile(fullPath)) return []

                    return [fullPath]
                }

                return []
            })

            const results = await Promise.all(promises)

            for (const result of results) filePaths.push(...result)
        } catch (error) {
            logger.error({
                title: "Failed to Read Directory",
                description: `Could not read directory "${currentPath}".`,
                data: { error }
            })
        }

        return filePaths
    }

    const result = await traverseDirectory(path)

    return result
}

/**
 * Expands a list of filesystem paths (files and directories) to include all contained file paths.
 */
export async function expandFilesystemPaths(
    paths: string[]
): Promise<string[]> {
    const filePaths: string[] = []

    const promises = paths.map(async path => {
        if (await isDirectory(path)) {
            const dirPaths = await introspectDirectory(path)

            filePaths.push(...dirPaths)
        } else if (await isFile(path)) {
            filePaths.push(path)
        }
    })

    await Promise.all(promises)

    return filePaths
}

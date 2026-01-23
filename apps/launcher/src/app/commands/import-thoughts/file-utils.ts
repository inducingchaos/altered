/**
 *
 */

import { readdir, readFile, stat } from "node:fs/promises"
import { basename, extname, join } from "node:path"

/**
 * File types that can safely be read as text content.
 */
const SUPPORTED_FILE_EXTENSIONS = new Set([".txt", ".md", ".markdown", ".mdc"])

export function isSupportedFileExtension(extension: string): boolean {
    return SUPPORTED_FILE_EXTENSIONS.has(extension.toLowerCase())
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

    const filePaths: string[] = []

    async function traverseDirectory(currentPath: string) {
        try {
            const dirEntries = await readdir(currentPath, {
                withFileTypes: true
            })

            const promises = dirEntries.map(async dirEntry => {
                const fullPath = join(currentPath, dirEntry.name)

                if (dirEntry.isDirectory() && recursively) {
                    const subDirPaths = await traverseDirectory(fullPath)

                    filePaths.push(...subDirPaths)
                } else if (dirEntry.isFile()) {
                    filePaths.push(fullPath)
                }
            })

            await Promise.all(promises)
        } catch (error) {
            console.error(`Error reading directory "${currentPath}".`, error)
        }

        return filePaths
    }

    return await traverseDirectory(path)
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

import { Command } from "./types"
import { execSync } from "child_process"
import merge from "merge-objects"
import { existsSync, readFileSync, rmSync } from "fs"
import { outputFileSync } from "fs-extra"
import uniq from "lodash/uniq"

type FileChanges = string | string[] | Record<string, unknown>

export const commands: Record<Command, Function> = {
  file: ({
    path,
    contents,
  }: {
    path: string
    contents: string | string[] | Record<string, unknown>
  }) => {
    syncFile(path, contents)
  },

  rm: ({ path }: { path: string }) => {
    if (existsSync(path)) rmSync(path)
  },
  run: ({ script }: { script: string }) => {
    execSync(script, { stdio: "inherit" })
  },
  "script": ({ name, script }: { name: string; script: string }) => {
    amendJson("package.json", {
      "scripts": {
        [name]: script,
      },
    })
  },
  yarn: ({ dev, pkg }: { dev?: boolean; pkg: string }) => {
    const dashDev = dev ? "-D " : ""
    execSync(`yarn add ${dashDev}${pkg}`, { stdio: "inherit" })
  },
}

const syncFile = (filename: string, changes: FileChanges) => {
  if (Array.isArray(changes)) {
    ensureLines(filename, changes)
  } else if (typeof changes === "string") {
    outputFileSync(filename, changes)
  } else {
    amendJson(filename, changes)
  }
}

const ensureLines = (filename: string, newLines: string[]) => {
  const originalContents = existsSync(filename)
    ? readFileSync(filename).toString()
    : ""
  const lines = originalContents.split("\n")
  for (const line of newLines) {
    if (lines.includes(line)) continue
    lines.unshift(line)
  }
  outputFileSync(filename, lines.join("\n"))
}

const amendJson = (filename: string, json: Record<string, unknown>) => {
  const originalContents = existsSync(filename)
    ? readFileSync(filename).toString()
    : "{}"
  const originalJson = JSON.parse(originalContents)
  const newJson = dedupe(merge(originalJson, json))
  outputFileSync(filename, JSON.stringify(newJson, null, 2))
}

type Json = Record<string, unknown>

const dedupe = (json: Json) => {
  for (const [key, value] of Object.entries(json)) {
    if (Array.isArray(value)) {
      json[key] = uniq(value)
    } else if (typeof value === "object") {
      json[key] = dedupe(value as Json)
    }
  }
  return json
}
import type { CommandGenerator, Precheck } from "@/commands"

export const precheck: Precheck = (_, args) => {
  if (!args.githubPackage[0]) {
    throw new Error(
      "githubPackage preset requires a scope, e.g. githubPackage:@my-scope"
    )
  }
}

export const generator: CommandGenerator = (presets, args) => {
  const [scope] = args.githubPackage

  return [
    {
      command: "file",
      path: "package.json",
      contents: {
        publishConfig: {
          [`${scope}:registry`]: "https://npm.pkg.github.com",
        },
      },
    },
    {
      command: "script",
      name: "auth:registry",
      script:
        'if test -f ".npmrc"; then echo "Error: registry auth overwrites .npmrc, delete yours and run this command again"; elif [ -z "$var" ]; then echo "Error: publishing a package to github requires a personal access token in \\$NPM_PKG_TOKEN"; else echo "@outerframe:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=$NPM_PKG_TOKEN" > .npmrc; fi',
    },
    ...(presets.includes("codespaces")
      ? ([
          {
            command: "file",
            path: ".devcontainer/devcontainer.json",
            contents: {
              postCreateCommand: ["yarn auth:registry"],
            },
          },
        ] as const)
      : []),
  ]
}

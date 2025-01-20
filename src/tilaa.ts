import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { toPlatformPath } from '@actions/core'
import * as tc from '@actions/tool-cache'
import { promises as fs } from 'fs'
import { spawn } from 'child_process'

const installer_version: string = '1.0.0'
const version: string = '0.1.1'

export const runCli = async (command: string) => {
  core.exportVariable('TILAA_PASSWORD', core.getInput('password'))

  const res = await exec.exec('tilaa', [
    command,
    '-u',
    core.getInput('username')
  ])

  if (res !== 0) {
    throw new Error(`failed to run command, code: ${res || 'null'}`)
  }

  return res
}

type SpawnResult = {
  code: number | null
  stdout: string | null
  stderr: string | null
}

export async function install() {
  try {
    // const ms: string = core.getInput('milliseconds')

    let installer = tc.find('tilaa-install.sh', installer_version)
    if (!installer) {
      core.info(
        `Didn't found installer in cache, downloading ${installer_version}`
      )
      const tmpInstallerPath = await tc.downloadTool(
        'https://tilaa.dev/install.sh'
      )
      await setPermissions(tmpInstallerPath)
      installer = await tc.cacheFile(
        tmpInstallerPath,
        'tilaa-installer',
        'tilaa-install.sh',
        installer_version
      )
    } else {
      core.info(`Found Tilaa installer ${installer_version} in cache`)
    }

    let tilaa = tc.find('tilaa', version)
    if (!tilaa) {
      await exec.getExecOutput(installer + '/tilaa-installer')

      await tc.cacheFile('tilaa', 'tilaa', 'tilaa', version)
    } else {
      core.info(`Found Tilaa cli ${version} in cache`)
    }

    core.addPath(tc.find('tilaa', version))
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

const setPermissions = async (filePath: string) => {
  core.debug(`chmod ${filePath}`)

  await fs.chmod(filePath, 0o755) // rwx r-x r-x

  if (core.isDebug()) {
    const stats = await fs.stat(filePath)
    core.debug(`mode ${stats.mode}`)
  }
}

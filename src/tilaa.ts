import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import { promises as fs } from 'fs'

const installer_version = '1.0.0'
const version = '1.0.38'

export const runCli = async (command: string): Promise<number> => {
  core.exportVariable('TILAA_PASSWORD', core.getInput('password'))

  const res = await exec.exec('nexaa', [
    command,
    '-u',
    core.getInput('username')
  ])

  if (res !== 0) {
    throw new Error(`failed to run command, code: ${res || 'null'}`)
  }

  return res
}

export async function install(): Promise<void> {
  try {
    // const ms: string = core.getInput('milliseconds')

    let installer = tc.find('nexaa-install.sh', installer_version)
    if (!installer) {
      core.info(
        `Didn't found installer in cache, downloading ${installer_version}`
      )
      const tmpInstallerPath = await tc.downloadTool(
        'https://nexaa.io/install.sh'
      )
      await setPermissions(tmpInstallerPath)
      installer = await tc.cacheFile(
        tmpInstallerPath,
        'nexaa-installer',
        'nexaa-install.sh',
        installer_version
      )
    } else {
      core.info(`Found Nexaa installer ${installer_version} in cache`)
    }

    const nexaa = tc.find('nexaa', version)
    if (!nexaa) {
      await exec.getExecOutput(installer + '/nexaa-installer')

      await tc.cacheFile('nexaa', 'nexaa', 'nexaa', version)
    } else {
      core.info(`Found Nexaa cli ${version} in cache`)
    }

    core.addPath(tc.find('nexaa', version))
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

const setPermissions = async (filePath: string): Promise<void> => {
  core.debug(`chmod ${filePath}`)

  await fs.chmod(filePath, 0o755) // rwx r-x r-x

  if (core.isDebug()) {
    const stats = await fs.stat(filePath)
    core.debug(`mode ${stats.mode}`)
  }
}

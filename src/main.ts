import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { promises as fs } from 'fs'
import { exec } from 'child_process'
import { install, runCli } from './tilaa'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  await install()
  await runCli('login')
}

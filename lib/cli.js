const fs = require('fs')

/**
 * @typedef Option
 * @property name
 * @property alias
 * @property description
 * @property defaultValue
 * @property type
 */

/**
 * @param {Option[]} options
 * @return {string}
 */
function buildOptionsTable (options) {
  const optionRows = options
    .map(({
      name,
      alias,
      description,
      defaultValue
    }) => `  --${name}, -${alias}\t${description}\t[default: ${defaultValue}]`.trimEnd())

  return `Options:\n${optionRows.join('\n')}`
}

/**
 * The following code is very ugly, but does the job :'(
 *
 * @param {string[]} argv
 * @param {Option[]} allowedOptions
 */
function parseArgv (argv, allowedOptions) {
  const remaining = [...argv]
  const result = {}

  for (const option of allowedOptions) {
    const optionAsFlag = `--${option.name}`
    const optionAliasAsFlag = `-${option.alias}`

    const optionIndex = remaining.findIndex(i => i.startsWith(optionAsFlag) || i.startsWith(optionAliasAsFlag))
    const argvOption = remaining[optionIndex]

    if (argvOption) {
      const isFlag = typeof option.defaultValue === 'boolean'

      if (isFlag) {
        result[option.name] = true
        remaining.splice(optionIndex, 1)
        continue
      }

      if (argvOption.includes('=')) {
        result[option.name] = argvOption.split('=')[1]
        remaining.splice(optionIndex, 1)
      } else if ([optionAsFlag, optionAliasAsFlag].includes(argvOption)) {
        result[option.name] = remaining[optionIndex + 1]
        remaining.splice(optionIndex, 2)
      } else if (argvOption.startsWith(optionAsFlag)) {
        result[option.name] = argvOption.split(optionAsFlag)[1]
        remaining.splice(optionIndex, 1)
      } else if (argvOption.startsWith(optionAliasAsFlag)) {
        result[option.name] = argvOption.split(optionAliasAsFlag)[1]
        remaining.splice(optionIndex, 1)
      }
    } else {
      result[option.name] = option.defaultValue
    }
  }

  // FIXME: there has to be a better way of doing this
  const scriptIndex = remaining.findIndex(e => {
    try {
      const stat = fs.statSync(e)
      return stat.isFile()
    } catch (e) {
      //
    }
  })

  const script = remaining[scriptIndex]

  if (scriptIndex > -1) {
    remaining.splice(scriptIndex, 1)
  }

  return {
    ...result,
    $$script: script,
    $$remaining: remaining
  }
}

module.exports = {
  buildOptionsTable,
  parseArgv
}

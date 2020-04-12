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

function getOption (option, argv = []) {
  const optionAsFlag = `--${option.name}`
  const optionAliasAsFlag = `-${option.alias}`

  const optionIndex = argv.findIndex(i => i.startsWith(optionAsFlag) || i.startsWith(optionAliasAsFlag))
  const argvOption = argv[optionIndex]

  if (argvOption) {
    const isFlag = typeof option.defaultValue === 'boolean'

    if (isFlag) {
      return true
    }

    if (argvOption.includes('=')) {
      return argvOption.split('=')[1]
    } else if ([optionAsFlag, optionAliasAsFlag].includes(argvOption)) {
      return argv[optionIndex + 1]
    } else if (argvOption.startsWith(optionAsFlag)) {
      return argvOption.split(optionAsFlag)[1]
    } else if (argvOption.startsWith(optionAliasAsFlag)) {
      return argvOption.split(optionAliasAsFlag)[1]
    }
  } else {
    return option.defaultValue
  }
}

function removeOptionFromArgv (option, argv) {
  const optionAsFlag = `--${option.name}`
  const optionAliasAsFlag = `-${option.alias}`

  const clone = argv.slice()

  const optionIndex = argv.findIndex(i => i.startsWith(optionAsFlag) || i.startsWith(optionAliasAsFlag))

  if (optionIndex > -1) {
    if ([optionAsFlag, optionAliasAsFlag].includes(argv[optionIndex])) {
      clone.splice(optionIndex, 2)
    } else {
      clone.splice(optionIndex, 1)
    }
  }

  return clone
}

module.exports = {
  getOption,
  buildOptionsTable,
  removeOptionFromArgv
}

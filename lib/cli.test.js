const assert = require('assert')
const { parseArgv } = require('./cli')

const getMockOption = (defaultValue) => ({
  name: 'option',
  alias: 'o',
  description: 'This is an option',
  defaultValue
})

suite('parseArgv', () => {
  test('returns $$remaining with all unparsed options', () => {
    const mockOption = getMockOption('option')
    const argv = ['node', 'lol.js', '--option=value']
    const result = parseArgv(argv, [mockOption])

    console.log(result)

    assert.deepStrictEqual(result.$$remaining, ['node', 'lol.js'])
  })

  suite('when parsing options', () => {
    test('uses default value if provided', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', 'lol.js']
      const result = parseArgv(argv, [mockOption])

      assert.strictEqual(result.option, 'option')
    })

    test('returns undefined if no default is provided', () => {
      const mockOption = getMockOption()
      const argv = ['node', 'lol.js']
      const result = parseArgv(argv, [mockOption])

      assert.strictEqual(result.option, undefined)
    })

    suite('with = separated args', () => {
      test('parses other values (full option)', () => {
        const mockOption = getMockOption('option')
        const argv = ['node', 'lol.js', '--option=value']
        const result = parseArgv(argv, [mockOption])

        assert.strictEqual(result.option, 'value')
      })

      test('parses other values (with alias)', () => {
        const mockOption = getMockOption('option')
        const argv = ['node', 'lol.js', '-o=value']
        const result = parseArgv(argv, [mockOption])

        assert.strictEqual(result.option, 'value')
      })
    })

    suite('with space separated args', () => {
      test('parses other values (full option)', () => {
        const mockOption = getMockOption('option')
        const argv = ['node', 'lol.js', '--option', 'value']
        const result = parseArgv(argv, [mockOption])

        assert.strictEqual(result.option, 'value')
      })

      test('parses other values (with alias)', () => {
        const mockOption = getMockOption('option')
        const argv = ['node', 'lol.js', '-o', 'value']
        const result = parseArgv(argv, [mockOption])

        assert.strictEqual(result.option, 'value')
      })
    })

    suite('with no separated args', () => {
      test('parses flags (full option)', () => {
        const mockOption = getMockOption(true)
        const argv = ['node', 'lol.js', '--option']
        const result = parseArgv(argv, [mockOption])

        assert.strictEqual(result.option, true)
      })

      test('parses flags (with alias)', () => {
        const mockOption = getMockOption(true)
        const argv = ['node', 'lol.js', '-o']
        const result = parseArgv(argv, [mockOption])

        assert.strictEqual(result.option, true)
      })

      test('parses other values (full option)', () => {
        const mockOption = getMockOption('option')
        const argv = ['node', 'lol.js', '--optionvalue']
        const result = parseArgv(argv, [mockOption])

        assert.strictEqual(result.option, 'value')
      })

      test('parses other values (with alias)', () => {
        const mockOption = getMockOption('option')
        const argv = ['node', 'lol.js', '-ovalue']
        const result = parseArgv(argv, [mockOption])

        assert.strictEqual(result.option, 'value')
      })
    })
  })

  suite('when parsing script', () => {
    test('populates the $$script property with script file', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', __filename, '--option=value']
      const result = parseArgv(argv, [mockOption])

      assert.strictEqual(result.$$script, __filename)
    })

    test('populates the $$script property with undefined', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', 'lol.js', '--option=value']
      const result = parseArgv(argv, [mockOption])

      assert.strictEqual(result.$$script, undefined)
    })
  })
})

const assert = require('assert')
const { getOption } = require('./cli')

const getMockOption = (defaultValue) => ({
  name: 'option',
  alias: 'o',
  description: 'This is an option',
  defaultValue
})

suite('getOption', () => {
  test('uses default value if provided', () => {
    const mockOption = getMockOption('option')
    const argv = ['node', 'lol.js']

    assert.strictEqual(getOption(mockOption, argv), 'option')
  })
  test('returns undefined if no default is provided', () => {
    const mockOption = getMockOption()
    const argv = ['node', 'lol.js']

    assert.strictEqual(getOption(mockOption, argv), undefined)
  })
  suite('with = separated args', () => {
    test('parses other values (full option)', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', 'lol.js', '--option=value']

      assert.strictEqual(getOption(mockOption, argv), 'value')
    })

    test('parses other values (with alias)', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', 'lol.js', '-o=value']

      assert.strictEqual(getOption(mockOption, argv), 'value')
    })
  })
  suite('with space separated args', () => {
    test('parses other values (full option)', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', 'lol.js', '--option', 'value']

      assert.strictEqual(getOption(mockOption, argv), 'value')
    })

    test('parses other values (with alias)', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', 'lol.js', '-o', 'value']

      assert.strictEqual(getOption(mockOption, argv), 'value')
    })
  })
  suite('with no separated args', () => {
    test('parses flags (full option)', () => {
      const mockOption = getMockOption(true)
      const argv = ['node', 'lol.js', '--option']

      assert.strictEqual(getOption(mockOption, argv), true)
    })

    test('parses flags (with alias)', () => {
      const mockOption = getMockOption(true)
      const argv = ['node', 'lol.js', '-o']

      assert.strictEqual(getOption(mockOption, argv), true)
    })
    test('parses other values (full option)', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', 'lol.js', '--optionvalue']

      assert.strictEqual(getOption(mockOption, argv), 'value')
    })

    test('parses other values (with alias)', () => {
      const mockOption = getMockOption('option')
      const argv = ['node', 'lol.js', '-ovalue']

      assert.strictEqual(getOption(mockOption, argv), 'value')
    })
  })
})

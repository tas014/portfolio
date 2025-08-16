type ValidChar = '*' | '°' | '¬' | '~'
type MapValue = {
  char: ValidChar
  wrapper: string
}

const notationMap: Map<string, MapValue> = new Map([
  ['green', { char: '*', wrapper: '<span class="green-text"></span>' }],
  ['red', { char: '°', wrapper: '<span class="red-text"></span>' }],
  ['purple', { char: '¬', wrapper: '<span class="purple-text"></span>' }],
  ['yellow', { char: '~', wrapper: '<span class="yellow-text"></span>' }],
])

function styleText(rawText: string): string {
  let outputText = rawText

  for (const notation of notationMap.values()) {
    const char = notation.char
    const wrapper = notation.wrapper

    const [wrapperStart, wrapperEnd] = [
      wrapper.slice(0, wrapper.indexOf('>') + 1),
      wrapper.slice(wrapper.indexOf('>') + 1),
    ]

    const pattern = new RegExp(`\\${char}(.*?)\\${char}`, 'gs')
    outputText = outputText.replaceAll(pattern, (match, content) => {
      return `${wrapperStart}${content}${wrapperEnd}`
    })
  }

  return outputText
    .replaceAll('\\*', '*')
    .replaceAll('\\°', '°')
    .replaceAll('\\¬', '¬')
    .replaceAll('\\~', '~')
}

export { styleText }

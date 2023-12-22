
export const ALPHA_LEN = 26
export const SAMPLELEN = 1
export const BATCHSIZE = 32
export const EPOCHS = 250
export const MAXLEN = 10
export let status = ''

export const setStatus = (currentStatus) => {
  status = currentStatus
}

export const delimiters: string[] = ['\r\n', '\r', ',', '\t', ' ']


/**
 * Creates a RegExp that matches strings up to a specified maximum length,
 * comprised solely of lowercase alphabets.
 *
 * @param {number} maxlen - The maximum length for the pattern.
 * @return {RegExp} A RegExp object for the generated pattern.
 */
export const preProcessPattern = ( maxlen: number ) => new RegExp('^[a-z]{1,' + maxlen + '}$')

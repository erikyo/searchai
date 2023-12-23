
export const ALPHA_LEN: number = 26
export const SAMPLELEN: number = 1
export const BATCHSIZE: number = 32
export const EPOCHS: number = 250
export const MAXLEN: number = 10
export let status: string = ''

export const setStatus = (currentStatus: string) => {
  status = currentStatus
}

export const delimiters: string[] = [' ','\r\n', '\r', ',', '\t']


/**
 * Creates a RegExp that matches strings up to a specified maximum length,
 * comprised solely of lowercase alphabets.
 *
 * @param {number} maxlen - The maximum length for the pattern.
 * @return {RegExp} A RegExp object for the generated pattern.
 */
export const preProcessPattern = ( maxlen: number ): RegExp => new RegExp('^[a-z]{1,' + maxlen + '}$')

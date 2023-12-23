export let status: string = ''

export const setStatus = (currentStatus: string) => {
  status = currentStatus
}

export const delimiters: string[] = [' ','\r\n', '\r', ',', '\t']

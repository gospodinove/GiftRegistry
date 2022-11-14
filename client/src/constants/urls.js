const BASE_URL = process.env.FRONT_END_BASE_URL

export const generateShareURL = registryId =>
  BASE_URL + '/registry/' + registryId

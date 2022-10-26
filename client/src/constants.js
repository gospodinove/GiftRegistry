export const BASE_URL = 'localhost:3000'

export const NAVBAR_HEIGHT = 64
export const NAVBAR_Z_INDEX = 9999

export const COLORS = {
  app: ['#1976D2', '#E32F2F', '#f57c00', '#388e3c', '#ab47bc'],
  profilePrimary: '#1976D2',
  profileSecondary: '#283e51',
  lightgray: '#a9a9a9',
  sliderInitial: '#ff0300',
  iconDefault: '#000000',
  black: '#000000',
  white: '#ffffff'
}

export const REGISTRY_TYPES = [
  'Birthday',
  'Wedding',
  'Graduation/Prom',
  'Christmas',
  'Custom'
]

export const AUTH_NAV_ITEMS = [
  { title: 'login', route: 'login', icon: 'login' },
  { title: 'register', route: 'register', icon: 'register' }
]

export const DATA_STATUS = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  failed: 'failed'
}

export const ERROR_TYPES = {
  general: 'general',
  unauthorized: 'unauthorized',
  incompleteRegistration: 'incomplete-registration',
  fieldErrors: 'field-errors'
}

export const USER_ROLES = {
  owner: 'owner',
  invitee: 'invitee'
}

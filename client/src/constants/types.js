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

export const MODAL_NAMES = {
  populateRegistryItem: 'populateRegistryItem',
  shareViaEmail: 'shareViaEmail',
  populateRegistry: 'populateRegistry',
  removeRegistryConfirmation: 'removeRegistryConfirmation',
  removeRegistryItemConfirmation: 'removeRegistryItemConfirmation',
  shareViaLinkConfirmation: 'shareViaLinkConfirmation'
}

export const POPULATE_REGISTRY_ITEM_MODAL_VARIANT = {
  update: 'update',
  create: 'create'
}

/* eslint-disable */

const sysUuAppWorkspaceInitDtoInType = shape({
  code: code().isRequired(),
  name: string(100).isRequired(),
  description: uu5String(4000),
  uuAppProfileAuthorities: uri().isRequired()
})

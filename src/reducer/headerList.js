const headerList = (state = '', action) => {
  switch (action.type) {
    case 'header':
      return action.text
    default:
      return state
  }
}
export default headerList;

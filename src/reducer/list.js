const todolist = (state = '', action) => {
  switch (action.type) {
    case 'INCREMENT':
      return action.text
    default:
      return state
  }
}
export default todolist;

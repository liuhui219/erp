import { combineReducers } from 'redux';
import todolist from './list';
import headerList from './headerList';
// import visibilityFilter from './visibilityFilter';

const Reducer = combineReducers({
    todolist,headerList,
});

export default Reducer;

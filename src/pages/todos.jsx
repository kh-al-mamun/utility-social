/* 
  !IMPORTANT!
  # ToDo app uses 'graphql-test-server-1' (local). It has todosSchema and todosResolver defined on that server.
*/

import MyHelmet from '../components/shared/MyHelmet';
import AddToDo from '../components/todos/AddToDo';
import ToDoLists from '../components/todos/ToDoLists';

const TodoMain = () => {
    return (
        <div>
            <MyHelmet titled={"Todos"}/>
            <AddToDo />
            <br />
            <ToDoLists />
            <br />
        </div>
    );
};

export default TodoMain;
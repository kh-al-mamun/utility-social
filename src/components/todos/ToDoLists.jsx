import { useQuery } from "@apollo/client";
import ToDoCard from "./ToDoCard";
import { Chip, Grid, Typography } from "@mui/material";
import { GET_TODOS } from "../../queries/todos";
import useUser from "../../hooks/useUser";

const ToDoLists = () => {
    const { userInfo, userInfoLoading } = useUser();
    const { data: allTodos = {}, loading, error } = useQuery(GET_TODOS, {
        variables: { userId: userInfo?._id },
        skip: !userInfo || userInfoLoading,
    });

    return (
        <div style={{ maxWidth: '767px', margin: '0 auto', border: '1px solid gray', borderRadius: '10px' }}>
            <Typography variant="h5" component="h2" p={2} align="center">
                Your ToDo Lists
            </Typography>
            <hr style={{ marginTop: '0' }} />

            <div style={{ padding: '1rem' }}>
                <Typography variant="h5" mb={2.5} fontWeight={300} >Pending:</Typography>
                {loading && <Chip label="Fetching data..." variant="filled" color="info" size="small" />}
                <Grid container spacing={2}>
                    {error ?
                        <Chip label="Error fetching data" variant="filled" color="error" /> :
                        (allTodos.todos && allTodos.todos.length === 0) ?
                            <Typography variant="subtitle1" color="secondary" margin="0 auto" >Nothing to show...</Typography> :
                            allTodos.todos && [...allTodos.todos].filter(todo => todo.status === 'PENDING').reverse().map(todo => <ToDoCard key={todo._id} todo={todo} userId={userInfo._id} />)
                    }
                </Grid>
            </div>

            <br />
            <div style={{ padding: '1rem' }}>
                <Typography variant="h5" mb={2.5} fontWeight={300} >Completed:</Typography>
                {loading && <Chip label="Fetching data..." variant="filled" color="info" size="small" />}
                <Grid container spacing={2} pb={2}>
                    {error ?
                        <Chip label="Error fetching data" variant="filled" color="error" /> :
                        (allTodos.todos && allTodos.todos.filter(todo => todo.status === 'COMPLETED').length === 0) ?
                        <Typography variant="subtitle1" color="secondary" margin="0 auto" >Nothing to show...</Typography> :
                        allTodos.todos && [...allTodos.todos].filter(todo => todo.status === 'COMPLETED').map(todo => <ToDoCard key={todo._id} todo={todo} userId={userInfo._id} />)
                    }
                </Grid>
            </div>
        </div>
    );
};


export default ToDoLists;
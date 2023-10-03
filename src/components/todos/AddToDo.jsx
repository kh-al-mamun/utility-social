import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { GET_TODOS } from "../../queries/todos";
import { useMutation } from "@apollo/client";
import { ADD_TODO } from "../../mutations/todos";
import useUser from "../../hooks/useUser";

const AddToDo = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [disable, setDisable] = useState(false);
    const { userInfo } = useUser();
    // const [AddTodo] = useMutation(ADD_TODO);
    const [AddTodo] = useMutation(ADD_TODO, { refetchQueries: [GET_TODOS], onCompleted: () => { '...' } });

    const handleAddToDo = async (event) => {
        event.preventDefault();
        if (title.trim() === '') {
            alert('Title can not be empty');
            return;
        }
        setDisable(true);
        try {
            const result = await AddTodo({
                variables: {
                    input: {
                        title,
                        description: desc,
                        timeInitiated: Date.now(),
                        status: "PENDING",
                        userId: userInfo._id
                    }
                },
                // refetchQueries: [
                //     {query: GET_TODOS}
                //     // {query: GET_TODOS, variables: {}}
                // ],
                // update: cache => {}
            })
            console.log(result);
            if (result?.data?.addTodo?.insertedId) {
                setTitle('');
                setDesc('');
            }
        }
        catch (error) {
            alert(error.message);
        }
        finally {
            setDisable(false)
        }
    }

    return (
        <div style={{ maxWidth: '767px', margin: '0 auto', border: '1px solid gray', borderRadius: '10px' }}>
            <Typography variant="h5" component="h2" p={2} align="center">
                Add New ToDo
            </Typography>
            <hr style={{marginTop: '0'}}/>
            <form onSubmit={handleAddToDo} style={{ padding: '1rem' }}>
                <TextField onInput={(e) => setTitle(e.target.value)} multiline id="outlined-basic" label="TODO TITLE" variant="outlined" color="primary" sx={{ width: { xs: '100%', sm: '35%' } }} value={title} />
                <TextField onInput={(e) => setDesc(e.target.value)} multiline id="outlined-basic" label="TODO DESCRIPTION" variant="outlined" color="primary" sx={{ width: { xs: '100%', sm: '65%' }, marginTop: { xs: '1rem', sm: '0' } }} value={desc} />
                <p></p>
                <Button type="submit" disabled={title === '' || disable} fullWidth variant="outlined" >Add TODO</Button>
            </form>
        </div>
    );
};

export default AddToDo;
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { gql, useMutation } from '@apollo/client';
import { DELETE_TODO, TOGGLE_TODO, UPDATE_TODO } from '../../mutations/todos';
import { useState } from 'react';
import { Divider, Grid, TextField } from '@mui/material';

export default function ToDoCard({ todo }) {
  const { _id, title, description, status, userId } = todo;
  const [editModeOn, setEditModeOn] = useState(false);
  const [UpdateTodo, { loading: loading3 }] = useMutation(UPDATE_TODO);
  const [DeleteTodo, { loading: loading2 }] = useMutation(DELETE_TODO, { variables: { todoId: _id, userId } });
  const [ToggleTodo, { loading }] = useMutation(TOGGLE_TODO, { variables: { todoId: _id } });

  const handleToggleTodo = async () => {
    try {
      await ToggleTodo({
        update: cache => {
          cache.writeFragment({
            id: `Todo:${_id}`, // The value of the to-do item's cache ID
            fragment: gql`
                fragment MyTodo_WriteStatus on Todo {
                  status
                },
              `,
            data: { status: status === 'PENDING' ? 'COMPLETED' : 'PENDING' }
          })
        }
      });
    }
    catch (error) {
      alert(error.message)
    }
    //if (!data?.data?.toggleTodo?.modifiedCount > 0) {
    // alert('Some error occurred! Please refresh the page.');
    // window.location.reload();
    //}
  }

  // const handleDeleteTodo = async () => {
  //   const data = await DeleteTodo({
  //     update: cache => {
  //       const oldTodoSet = cache.readQuery({
  //         query: GET_TODOS,
  //         variables: {
  //           userId: "64cf43e4c5da7621bb00a05b"
  //         }
  //       })
  //       // const newTodoSet = oldTodoSet.todos.filter(todo => todo._id !== _id)
  //       cache.writeQuery({
  //         query: GET_TODOS,
  //         data: {todos: oldTodoSet.todos.filter(todo => todo._id !== _id)},
  //         variables: {
  //           userId: "64cf43e4c5da7621bb00a05b"
  //         }
  //       })
  //     }
  //   });
  //   if (data?.data?.deleteTodo?.success) {
  //     //
  //   }
  // }

  const handleDeleteTodo = async () => {
    try {
      await DeleteTodo({
        update: cache => {
          cache.modify({
            fields: {
              todos(existingTodos = [], { readField }) {
                return existingTodos.filter(todoRef => _id !== readField('_id', todoRef))
              }
            }
          })
        }
      })
    }
    catch (error) {
      alert(error.message)
    }
  }

  const handleTodoChange = async (event) => {
    event.preventDefault();
    const newTitle = event.target.title.value || '';
    const newDescription = event.target.description.value || description;
    if (newTitle.trim() === '') {
      alert('Title can not be empty!');
      return;
    }
    console.log(newTitle, newDescription);
    try {
      await UpdateTodo({
        variables: {
          todoId: _id, 
          userId,
          input: {
            title: newTitle,
            description: newDescription
          }
        },
        update: cache => {
          cache.writeFragment({
            id: `Todo:${_id}`, // The value of the to-do item's cache ID
            fragment: gql`
              fragment UpdateTodo on Todo { # fields that needs an update
                title
                description
              }
            `,
            data: { // values for the fields require update
              title: newTitle,
              description: newDescription
            }
          })
        }
      });
      setEditModeOn(false)
    }
    catch (error) {
      alert(error.message)
    }
  }


  return (
    <Grid item xs={12} sm={6}>
      <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" fontWeight={400} style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            <span style={{ textTransform: 'capitalize' }}>{title}</span>
            <Chip label={status} variant="filled" size='small' color={status === 'PENDING' ? 'warning' : 'success'} style={{ opacity: '.75' }} />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          {
            status === 'PENDING' ?
              <>
                <Button onClick={handleToggleTodo} disabled={loading} size="small" variant='outlined'>Mark Completed</Button>
                <Button onClick={() => setEditModeOn(prev => !prev)} disabled={loading} size="small" variant='outlined'>Edit Todo</Button>
              </> :
              <>
                <Button onClick={handleToggleTodo} disabled={(loading || loading2)} size="small" variant='outlined' color='warning'>Undo Completed</Button>
                <Button onClick={handleDeleteTodo} disabled={(loading || loading2)} size="small" variant='outlined' color='warning'>Delete</Button>
              </>
          }
        </CardActions>

        {editModeOn && <CardContent >
          <Divider />
          <form onSubmit={handleTodoChange}>
            <Typography variant='caption' color={'GrayText'}>
              <p><b>Edit this TODO</b></p>
            </Typography>
            <TextField multiline fullWidth name='title' label="New Title" variant="outlined" size='small' />
            <p></p>
            <TextField multiline fullWidth name='description' label="New Description" variant="outlined" size='small' />
            <p></p>
            <div style={{ display: 'flex' }}>
              <Button disabled={loading3} type="submit" fullWidth variant="outlined" color="success">Okay</Button>
              <Button onClick={() => setEditModeOn(false)} disabled={loading3} fullWidth variant="outlined" color="error">Cancel</Button>
            </div>
          </form>
        </CardContent>}
      </Card>
    </Grid>
  );
}
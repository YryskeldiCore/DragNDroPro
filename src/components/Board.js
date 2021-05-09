import React, {Fragment, useState } from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {IconButton, TextField} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EditIcon from '@material-ui/icons/Edit';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Board = () => {

    const [boards, setBoards] = useState([
        {id:1, title: 'Сделать', items: [{id:1, name: 'Пропылесосить'}, {id:2, name: 'Покодить'}]},
        {id:2, title: 'Проверить', items: [{id:3, name: 'ПоРеактить'}, {id:4, name: 'Покушать'}]},
        {id:3, title: 'Сделано', items: [{id:5, name: 'ПоПыхыпыхать'}, {id:6, name: 'Пойти спать'}]}
    ]);

    const [currentBoard, setCurrentBoard]= useState(null);
    const [currentBoardItem , setCurrentBoardItem] = useState(null);
    const [name, setName] = useState('');
    const [isShown , setIsShown] = useState(Number);
    const [isEditShown, setIsEditShown] = useState(Number);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openDrop, setOpenDrop] = useState(false)
    const [editText, setEditText] = useState('');


    const dragStartHandler = (board, boarditem) => {
        setCurrentBoard(board);
        setCurrentBoardItem(boarditem);
    }

    const dragLeaveHandler = (e) => {
        e.target.style.boxShadow = 'none'; 
    }

    const dragOverHandler = (e) => {
        e.preventDefault();
        if(e.target.className === 'boarditem'){
            e.target.style.boxShadow = '0 8px 16px black';
        }
    }

    const dragEndHandler = (e) => {
        e.target.style.boxShadow = 'none'; 
    }

    const dropHandler = (e, board, boarditem) => {
        e.preventDefault();
        const currentItemIndex = currentBoard.items.indexOf(currentBoardItem);
        currentBoard.items.splice(currentItemIndex, 1);
        const dropItemIndex = board.items.indexOf(boarditem);
        board.items.splice(dropItemIndex + 1, 0 , currentBoardItem);
        setBoards(boards.map(b => {
            if(b.id === board.id){
                return board;
            }
            if(b.id === currentBoard.id){
                return currentBoard
            }
            return b
        }))
    }

    const handleClose = () => {
        setOpen(false);
        setOpenEdit(false);
        setOpenDelete(false);
        setOpenDrop(false);
    }

    const dropCardHandler = (e, board) => {
        if(e.target.className !== 'boarditem'){
            board.items.push(currentBoardItem)
            const currentItemIndex = currentBoard.items.indexOf(currentBoardItem); 
            currentBoard.items.splice(currentItemIndex, 1);
            setBoards(boards.map(b => {
                if(b.id === board.id){
                    return board;
                }
                if(b.id === currentBoard.id){
                    return currentBoard;
                }
                return b;
            }))
        }
    }

    const handleChange = (e) => {
        setName(e.target.value);
    }

    const handleSubmit = (e, board) => {
        e.preventDefault();
        if(name.length === 0){
            return;
        }
        const newTask = {
            id: Date.now(),
            name: name
        }
        board.items.push(newTask);
        setBoards(boards.map(b => {
            return b;
        }))
        setName('');
    }

    const deleteBoardItem = (id, board) => {
        const currentBoardItemIndex = board.items.findIndex(item => item.id === id);
        const newArr = [...board.items.slice(0, currentBoardItemIndex), ...board.items.slice(currentBoardItemIndex + 1)];
        setBoards(boards.map(b => {
            if(b.id === board.id){
                b.items = newArr
                return b
            }
            return b
        }))
    }

    const editBoardItem = (e, id, board) => {
        if(e.type !== 'click'){
            e.preventDefault()
        }
        setBoards(boards.map(b => {
            if(b.id === board.id){
                const arr = [...b.items]
                arr.forEach(item => {
                    if(item.id === id){
                        item.name = editText
                        return b
                    }
                })
            }
            return b
        }))
        setIsEditShown(null);
    }

    const handleEditChange = (editValue) => {
        setEditText(editValue)
    }

    return(
        <div className="boardswrapper">
            {boards.map(board => 
                <div 
                    onDragOver={(e) => dragOverHandler(e)}
                    onDrop={(e) => {
                        dropCardHandler(e, board);
                        setOpenDrop(true)
                    }}
                    className="board">
                    <div className="boardtitle">{board.title}</div>
                        <div className="boarditemwrap">
                            {board.items.map((boarditem) => 
                                <div 
                                    key={boarditem.id}
                                    onDragStart={() => dragStartHandler(board, boarditem)}
                                    onDragLeave={(e) => dragLeaveHandler(e)}
                                    onDragOver={(e) => dragOverHandler(e)}
                                    onDragEnd={(e) => dragEndHandler(e)}
                                    onDrop={(e) => dropHandler(e, board, boarditem)}
                                    draggable={true}
                                    className="boarditem">
                                    {isEditShown === boarditem.id ? 
                                            <form 
                                                className='' 
                                                noValidate 
                                                autoComplete="off" 
                                                onSubmit={(e) => {editBoardItem(e, boarditem.id, board);setOpenEdit(true)}}>
                                                <TextField
                                                value={editText}
                                                onChange={(e) => handleEditChange(e.target.value)}
                                                InputProps={{
                                                    endAdornment:
                                                        <Fragment>
                                                            <IconButton onClick={(e) => {
                                                                editBoardItem(e, boarditem.id, board);
                                                                setIsEditShown(false);
                                                                setOpenEdit(true)
                                                            }}>
                                                                <CheckCircleOutlineIcon/>
                                                            </IconButton>
                                                            <IconButton onClick={() => {setIsEditShown(false)}}>
                                                                <CancelIcon/>
                                                            </IconButton>
                                                        </Fragment>
                                                }}/>
                                            </form>
                                        :
                                            boarditem.name
                                        }
                                    
                                    <div className="boarditem-icons">
                                        <HighlightOffIcon onClick={() => {
                                                deleteBoardItem(boarditem.id, board);
                                                setOpenDelete(true);
                                            }
                                        }/>
                                        <EditIcon onClick={() => {
                                            setIsEditShown(boarditem.id);
                                            setEditText(boarditem.name)
                                            }
                                        }/>
                                    </div>
                                </div>    
                            )}
                        <form 
                            className='' 
                            noValidate 
                            autoComplete="off" 
                            onSubmit={(e) => {
                                handleSubmit(e, board);
                                setOpen(true)}
                            }>
                            {isShown === board.id ? 
                                <TextField
                                value={name}
                                onChange={(e) => handleChange(e)}
                                InputProps={{
                                    endAdornment:
                                        <Fragment>
                                            <IconButton onClick={(e) => {
                                                setIsShown(false);
                                                handleSubmit(e, board);
                                                setOpen(true)
                                            }}>
                                                <CheckCircleOutlineIcon/>
                                            </IconButton>
                                            <IconButton onClick={() => {setIsShown(false)}}>
                                                <CancelIcon/>
                                            </IconButton>
                                        </Fragment>
                                }}/>
                            :
                                null
                            }
                            <IconButton onClick={() => {
                                setIsShown(board.id);
                            }}>
                                {isShown === board.id ? 
                                    null
                                    :
                                    <div>Add new Card with Task</div>
                                }
                                <AddBoxIcon/>
                            </IconButton>
                            <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success">
                                Successfully Added!
                                </Alert>
                            </Snackbar>
                            <Snackbar open={openDrop} autoHideDuration={1500} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success">
                                Successfully Replaced!
                                </Alert>
                            </Snackbar>
                            <Snackbar open={openEdit} autoHideDuration={1500} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success">
                                Successfully Edited!
                                </Alert>
                            </Snackbar>
                            <Snackbar open={openDelete} autoHideDuration={1500} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="error">
                                Successfully Deleted!
                                </Alert>
                            </Snackbar>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Board;
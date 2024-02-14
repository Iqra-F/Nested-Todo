import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";

function NestedTodo() {
  const [todos, setTodos] = useState([]); //array holding the list of todo items
  const [todoInput, setTodoInput] = useState(""); //input field for adding new tasks
  const [todoDescription, setTodoDescription] = useState(""); // input field for adding descriptions
  const [editIndex, setEditIndex] = useState(null); //index of the todo item being edited.
  const [editValue, setEditValue] = useState(""); //input field for editing the task name.
  const [editDescription, setEditDescription] = useState(""); //input field for editing the desc.
  const [modal, setModal] = useState(false); //to manage the visibility of modal for updation
  const [modalDelete, setModalDelete] = useState(false); //to manage the visibility of modal for deletion
  const [showNameError, setShowNameError] = useState(false);
  const [showDescError, setShowDescError] = useState(false);

  const toggleUpdate = () => setModal(!modal); //to toggle the visibility of modal for updation
  const toggleDelete = () => setModalDelete(!modalDelete); //to toggle the visibility of modal for deletion

  const addTodo = () => {
    try {
      if (!todoInput.trim()) {
        setShowNameError(true);
        return;
      }
      setShowNameError(false);

      if (!todoDescription.trim()) {
        setShowDescError(true);
        return;
      }
      setShowDescError(false);
    } catch (error) {
      console.log(error);
    }

    setTodos([
      ...todos,
      {
        text: todoInput,
        description: todoDescription,
        completed: false,
        subDescriptions: [] //property to hold sub-descriptions
      },
    ]);
    setTodoInput("");
    setTodoDescription("");
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
    toggleDelete();
  };

  const updateTodo = () => {
    if (!editValue.trim()) {
      return window.alert("Task name is required!");
    }
    const updatedTodos = [...todos];
    updatedTodos[editIndex] = {
      ...updatedTodos[editIndex],
      text: editValue,
      description: editDescription,
    };
    setTodos(updatedTodos);
    toggleUpdate();
    setTimeout(() => {
      alert("Task Edited successfully!");
    }, 2000);
  };

  const completeTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const addSubDescription = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].subDescriptions.push(""); // add an empty string for new sub-description
    setTodos(updatedTodos);
  };

  const removeSubDescription = (todoIndex, subDescIndex) => {
    const updatedTodos = [...todos];
    updatedTodos[todoIndex].subDescriptions.splice(subDescIndex, 1); // remove the sub-description at index
    setTodos(updatedTodos);
  };

  return (
    <div className="container w-[100%] h-full mx-0  bg-cyan-300 p-4">
      <h1 className="text-3xl text-center mb-4">Todo App</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex flex-col">
          <p>Name:</p>
          <input
            type="text"
            placeholder="Task"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            className="p-2 mr-2 border rounded"
          />
          {showNameError && (
            <span className="block w-full p-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-red-600">
              Please fill in the input field
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p>Description:</p>
          <input
            type="text"
            placeholder="Description"
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
            className="p-2 mr-2 border rounded"
          />
          {showDescError && (
            <span className="block bg-white w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-red-600">
              Please fill in the input field
            </span>
          )}
        </div>

        <button
          onClick={addTodo}
          disabled={!todoInput.trim() || !todoDescription.trim()} //if any of i/p fields is empty & the user press the Add todo btn, btn will be disabled
          className="bg-rose-400 text-white p-1 ml-2 h-11 rounded"
        >
          Add Todo
        </button>
      </div>

      <ul>
        <div className="flex flex-col justify-evenly gap-9">
          {todos.map((todo, index) => (
            <li key={index} className="mb-2">
              <strong className={todo.completed ? "line-through" : ""}>
                {todo.text}
              </strong>

              {todo.description && (
                <p className={todo.completed ? "line-through" : ""}>
                  {todo.description}
                </p>
              )}

              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() => toggleDelete()}
                  className="bg-red-500 text-white px-1 w-auto py-1 mr-2 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    setEditIndex(index);
                    setEditValue(todo.text);
                    setEditDescription(todo.description);
                    toggleUpdate();
                  }}
                  className="bg-yellow-500 text-white px-4 py-1 mr-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => completeTodo(index)}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  {todo.completed ? "undo" : "Completed"}
                </button>
              </div>

              <div>
                {todo.subDescriptions.map((subDesc, subDescIndex) => (
                  <div key={subDescIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={subDesc}
                      onChange={(e) => {
                        const updatedTodos = [...todos];
                        updatedTodos[index].subDescriptions[subDescIndex] = e.target.value;
                        setTodos(updatedTodos);
                      }}
                      className="p-2 border rounded"
                    />
                    <button
                      onClick={() => removeSubDescription(index, subDescIndex)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button onClick={() => addSubDescription(index)} className="bg-blue-500 text-white px-2 mt-2 rounded">
                  Add Sub-description
                </button>
              </div>
            </li>
          ))}
        </div>
      </ul>

      <Modal className="mt-6" isOpen={modal} toggle={toggleUpdate}>
        <ModalBody>
          <div className="">
            <p>Edit Name:</p>
            <input
              type="text"
              placeholder="Task"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="p-2 mb-2 border rounded w-full"
            />
          </div>

          <div className="">
            <p>Edit Description:</p>
            <input
              type="text"
              placeholder="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="p-2 mb-2 border rounded w-full"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="bg-blue-800" onClick={updateTodo}>
            Update
          </Button>{" "}
          <Button className="bg-gray-700" onClick={toggleUpdate}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete} toggle={toggleDelete}>
        <ModalHeader toggle={() => setModalDelete(!modalDelete)}>Please Confirm again before press OK!</ModalHeader>
        <ModalBody>
          <p>You are Deleting The Todo</p>
        </ModalBody>
        <ModalFooter>
          <Button className="bg-purple-800" onClick={() => deleteTodo(editIndex)}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default NestedTodo;

<template>
  <div
    class="min-h-screen flex w-full items-center justify-center bg-sky-100 font-mono"
  >
    <div class="bg-white rounded-xl shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
      <h1 class="flex justify-center text-gray-700 text-5xl mt-16">
        To Do List
      </h1>
      <div class="flex items-center border-b-2 border-blue-00 py-2 my-5">
        <input
          class="appearance-none bg-transparent border-none w-full text-blue-900 mr-3 py-1 px-2 focus:outline-none"
          type="text"
          placeholder="Add To-do"
          v-model="newTodo.text"
          @keydown.enter="addTodo"
        />
        <button
          class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="button"
          @click="addTodo"
        >
          + Add
        </button>
      </div>
      <h1 class="text-gray-600 text-2xl mt-16">To do</h1>
      <ul>
        <li
          v-for="(todo, index) in todos"
          :key="index"
          class="border-gray-600 flex flex-row"
        >
          <div
            class="flex flex-1 p-3 rounded-xl border-2 m-1 border-gray-600"
            v-if="!todo.checked"
          >
            <div class="flex flex-1 justify-between">
              <div class="w-2/3">
                <input
                  type="checkbox"
                  class="form-checkbox my-2 h-5 w-5 text-gray-600"
                  :id="'todo-' + index"
                  v-model="todo.checked"
                  @click="checkTodo(todo)"
                />
                <label
                  class="text-gray-600 font-medium text-2xl pl-2"
                  v-if="!todo.isEdit"
                  >{{ todo.text }}</label
                >
                <label
                  class="inline-block text-gray-600 font-medium text-2xl pl-2"
                  v-else
                >
                  <input
                    class="w-40 w-full bg-gray-100 text-gray-700 px-1 border-2 border-gray-600 rounded w-40 lg:w-40 sm:w-full"
                    type="text"
                    v-model="editTodo"
                    ref="myinput"
                    @keydown.enter="updateTodo(todo)"
                  />
                </label>
              </div>
              <div class="w-1/3 content-end flex justify-end ml-5">
                <button
                  v-if="!todo.isEdit"
                  class="items-center bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                  type="button"
                  @click="deleteTodo(todo)"
                >
                  Delete
                </button>
                <button
                  v-if="!todo.isEdit"
                  class="items-center bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded ml-2"
                  type="button"
                  @click="showEdit(todo, index)"
                >
                  Edit
                </button>
                <button
                  v-else
                  class="items-center bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded ml-2"
                  type="button"
                  @click="updateTodo(todo)"
                >
                  Done Edit
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <h1 class="text-gray-600 text-2xl mt-16">Completed</h1>
      <ul>
        <li
          v-for="(todo, index) in todos"
          :key="index"
          class="border-gray-600 flex flex-row w-full"
        >
          <div
            class="flex flex-1 p-3 rounded-xl border-2 m-1 border-gray-400 bg-gray-200"
            v-if="todo.checked"
          >
            <div class="flex flex-1 justify-between">
              <div class="w-2/3 break-all">
                <input
                  type="checkbox"
                  class="form-checkbox my-2 h-5 w-5"
                  :id="'todo-' + index"
                  v-model="todo.checked"
                  disabled
                />
                <label class="text-gray-400 font-medium text-2xl pl-2">{{
                  todo.text
                }}</label>
              </div>
              <div class="w-1/3 content-end flex justify-end ml-5">
                <button
                  v-if="!todo.isEdit"
                  class="items-center bg-blue-700 hover:bg-blue-800 border-blue-700 hover:border-blue-800 text-sm border-4 text-white py-1 px-2 rounded"
                  type="button"
                  @click="deleteTodo(todo)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import TodoDataService from "../services/TodoDataService";

export default {
  setup() {
    const newTodo = ref({
      id: null,
      text: "",
      isEdit: false,
      checked: false,
    });
    const editTodo = ref("");
    const message = ref("");
    const todos = ref([]);
    const text = ref("");
    const completed = ref([]);
    const currentTodo = ref([]);

    function retrieveTodos() {
      TodoDataService.getAll()
        .then((response) => {
          todos.value = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function addTodo() {
      var data = {
        text: newTodo.value.text,
      };
      TodoDataService.create(data)
        .then((response) => {
          console.log(response.data);
          // Refresh the todolist
          retrieveTodos();
          // Clear the todo input
          newTodo.value = {};
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function showEdit(todo, index) {
      currentTodo.value = todo;
      todo.isEdit = true;
      editTodo.value = todo.text;
    }

    function updateTodo(todo) {
      todo.isEdit = false;
      todo.text = editTodo.value;
      TodoDataService.update(currentTodo.value.id, currentTodo.value)
        .then((response) => {
          console.log(response.data);
          message.value = "The todo was updated successfully!";
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function checkTodo(todo) {
      currentTodo.value = todo;
      todo.checked = true;
      TodoDataService.update(currentTodo.value.id, currentTodo.value)
        .then((response) => {
          console.log(response.data);
          this.message = "The todo was updated successfully!";
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function deleteTodo(todo) {
      TodoDataService.delete(todo.id)
        .then((response) => {
          console.log(response.data);
          // Refresh the todolist
          retrieveTodos();
        })
        .catch((e) => {
          console.log(e);
        });
    }

    onMounted(() => {
      retrieveTodos();
    });

    return {
      newTodo,
      editTodo,
      message,
      todos,
      text,
      completed,
      currentTodo,
      retrieveTodos,
      addTodo,
      checkTodo,
      showEdit,
      updateTodo,
      deleteTodo,
    };
  },
};
</script>

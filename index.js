const STORAGE_KEY = 'todos-vuejs'
const todoStorage = {
  load () {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach((todo, idx) => {
      todo.id = idx
    })
    todoStorage.uid = todos.length
    return todos
  },
  save (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const app = Vue.createApp({
  data () {
    const data = {
      todos: todoStorage.load(),
      title: '',
      done: false,
      edit: null
    }
    return data
  },
  methods: {
    addTodo () {
      this.title = this.title.trim()
      if (!this.title) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: this.title,
        done: false,
        edit: null
      })
      todoStorage.save(this.todos)
      this.title = ''
    },
    switchTodo () {
      this.done = !this.done
    },
    changeStatus (todo) {
      todo.done = !todo.done
      todoStorage.save(this.todos)
    },
    deleteTodo (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      todoStorage.save(this.todos)
    },
    editTodo (todo) {
      todo.edit = !todo.edit
      this.beforeEdit = todo.title
      if (todo.edit) {
        this.$nextTick(() => this.$refs.todoTitle.focus())
      }
    },
    doneEdit (todo) {
      todo.title = todo.title.trim()
      todo.edit = null
      if (!todo.title) {
        this.cancelEdit(todo)
      }
      todoStorage.save(this.todos)
    },
    cancelEdit (todo) {
      todo.title = this.beforeEdit
      todo.edit = null
    }
  },
  computed: {
    todoList () {
      return this.todos.filter(todo => this.done === todo.done).sort((a, b) => b.id - a.id)
    },
    statusTitle () {
      return this.done ? 'DONE LIST' : 'TODO LIST'
    },
    buttonLabel () {
      return this.done ? 'Undo' : 'Done'
    }
  }
})

app.mount('#app')

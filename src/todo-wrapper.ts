import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import "./todo-item.ts";

interface TodosList {
    id: number;
    name: string;
    completed: boolean;
}

@customElement('todo-wrapper')
export class TodoWrapper extends LitElement {
    static styles = css`
        :host {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
        }

        input {
            border: none;
            outline: none;
            border-radius: 15px;
            padding: 1em;
            background-color: #ccc;
            box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.3);
            transition: 300ms ease-in-out;
        }
        
        .wrapper {
            display: block;
            min-width: 400px;
            min-height: 200px;
            border: 1px solid gray;
            padding-bottom: 20px;
        }
    `;

    @property({type: Array}) todoList: TodosList[] = [
        {id: 1, name: 'Learn Lit', completed: false},
        {id: 2, name: 'Learn React', completed: true},
        {id: 22, name: 'Learn JS', completed: true},
    ];
    @query("input") textField!: HTMLInputElement;

    onAddTodo(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.todoList = [...this.todoList, {
                id: (new Date()).getTime(),
                name: this.textField.value.trim(),
                completed: false,
            }]
            this.textField.value = "";
        }
    }

    removeTodo(evt: CustomEvent) {
        const currentId = evt.detail;
        this.todoList = this.todoList.filter(todo => todo.id !== currentId);
    }

    onToggleComplete = (evt: CustomEvent) => {
        const currentId = evt.detail;
        this.todoList = this.todoList.map(todo => todo.id === currentId ? {...todo, completed: !todo.completed} : todo
        );
    }

    renderTodoList(todos: TodosList[], listName: string, completed: boolean) {
        return html`
            <ul class="wrapper">
                <h2>${listName}</h2>
                ${repeat(todos.filter((item) => completed ? item.completed : !item.completed
                ), (todo) => todo.id, (todo) => {
                    return html`<todo-item .todo=${todo} @remove=${this.removeTodo} @toggle=${this.onToggleComplete}></todo-item>`
                })}
            </ul>
        `
    }

    render() {
        return html`
            <div>
                <input 
                        type="text" 
                        id="todoInput" 
                        placeholder="Write a todo name"
                        @keydown=${this.onAddTodo}
                >
                <div style="display: flex; text-align: start">
                    ${this.renderTodoList(this.todoList, "Current Todos", false)}
                    ${this.renderTodoList(this.todoList, "Completed Todos", true)}
                </div>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'todo-wrapper': TodoWrapper
    }
}
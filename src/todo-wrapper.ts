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

    removeTodo(currentId: number) {
        this.todoList = this.todoList.filter(todo => todo.id !== currentId);
    }

    onToggleComplete = (id: number)=> {
        this.todoList = this.todoList.map(todo =>
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        );
    }

    render() {
        const currentTodos = this.todoList.filter(todo => !todo.completed);
        const completedTodos = this.todoList.filter(todo => todo.completed);

        return html`
            <div>
                <input 
                        type="text" 
                        id="todoInput" 
                        placeholder="Write a todo name"
                        @keydown=${this.onAddTodo}
                >
                <div style="display: flex; text-align: start">
                    <ul class="wrapper">
                        <h2>Current Tasks</h2>
                        ${repeat(currentTodos, (todo) => todo.id, (todo) => {
                            return html`
                                <todo-item
                                        .todo=${todo}
                                        .removeTodo=${() => this.removeTodo(todo?.id)}
                                        .onToggleComplete=${() => this.onToggleComplete(todo?.id)}
                                >
                                </todo-item>
                            `
                        })}
                    </ul>
                    <ul class="wrapper">
                        <h2>Completed Tasks</h2>
                        ${repeat(completedTodos, (todo) => todo.id, (todo) => {
                            return html`
                                <todo-item
                                        .todo=${todo}
                                        .removeTodo=${() => this.removeTodo(todo?.id)}
                                        .onToggleComplete=${() => this.onToggleComplete(todo?.id)}
                                >
                                </todo-item>
                            `
                        })}
                    </ul>
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
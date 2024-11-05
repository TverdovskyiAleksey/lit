import {LitElement, html, css, nothing} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js'
import {ifDefined} from 'lit/directives/if-defined.js';

interface TodosList {
    id: number;
    name: string;
    completed: boolean;
}

@customElement('todo-item')
export class TodoItem extends LitElement {
    static styles = css`
        li {
            display: flex;
            align-items: center;
        }

        button {
            color: white;
            width: 70px;
            height: 30px;
            border-radius: 10px;
            cursor: pointer;
        }

        .saveBtn {
            background: darkgreen;
            border-color: darkgreen;
            margin-right: 10px;
        }

        .editBtn {
            background: darkblue;
            border-color: darkblue;
            margin-right: 10px;
        }

        .deleteBtn {
            background: darkred;
            border-color: darkred;
        }

        .editTextField {
            width: 100px;
            margin: 0 10px;
            padding-left: 12px;
        }

        .todoName {
            width: 128px;
            margin: 0 0 0 10px;
            text-align: start;
        }
    `;
    @property({type: Object}) todo: TodosList | null = null;
    @state() isEditClicked = false;

    @query("input") textField!: HTMLInputElement;

    onEditBtnClick = () => {
        this.isEditClicked = true;
    }

    onSaveBtnClick = () => {
        this.isEditClicked = false;
    }

    onUpdateTodoName = (event: KeyboardEvent) => {
        if (this.todo) {
            const input = event.target as HTMLInputElement;
            this.todo.name = input.value;
        }
    }

    removeTodo() {
        if (this.todo) {
            this.dispatchEvent(new CustomEvent('remove', {
                detail: this.todo.id,
                bubbles: true,
            }))
        }
    }

    onToggleComplete() {
        if (this.todo) {
            this.dispatchEvent(new CustomEvent('toggle', {
                detail: this.todo.id,
                bubbles: true,
            }))
        }
    }

    render() {
        return html`
            <li>
                <input 
                    type="checkbox" 
                    ?checked=${this.todo?.completed}
                    @change=${this.onToggleComplete}
                />
                ${this.isEditClicked 
                        ? html`<input type="text" class="editTextField" value=${ifDefined(this.todo?.name)} @input=${this.onUpdateTodoName}>`
                        : html`<p class="todoName">${this.todo?.name}</p>`
                }
                ${this.todo?.completed
                        ? nothing
                        : html`
                            ${this.isEditClicked
                                    ? html`<button class="saveBtn" @click=${this.onSaveBtnClick}>Save</button>`
                                    : html`<button class="editBtn" @click=${this.onEditBtnClick}>Edit</button>`
                            }
                        `
                }
                <button class="deleteBtn" @click=${this.removeTodo}>Remove</button>
            </li>
        `;
    }
}

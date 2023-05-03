function toDo({ todo, toggleTask, removeTask }) {
  return (
    <div key={todo.id} className="item-form">
      <div
        className={todo.complete ? "item-text strike" : "item-text"}
        onClick={() => toggleTask(todo.id)}
      >
        {todo.task}
      </div>
      <div className="item-delete" onClick={() => removeTask(todo.id)}>
        &#10060;
      </div>
    </div>
  );
}
export default toDo;

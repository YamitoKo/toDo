import { useState, useEffect } from "react";
import { CircularProgress, Slide } from "@mui/material";
import ToDo from "./toDo";
import ToDoForm from "./toDoForm";

function App() {
  const [cityName, setCityName] = useState("Moscow");
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  const addTask = (inputText) => {
    if (inputText) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        task: inputText,
        complete: false,
      };
      setTodos([...todos, newItem]);
    }
  };

  const removeTask = (id) => {
    setTodos([...todos.filter((todo) => todo.id !== id)]);
  };

  const handleToggle = (id) => {
    setTodos([
      ...todos.map((todo) =>
        todo.id === id ? { ...todo, complete: !todo.complete } : { ...todo }
      ),
    ]);
  };
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=262aa0e74b779af121790344e8b264db&units=metric`
    )
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error("Что-то пошло не так");
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cityName, error]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCityName(e.target.value);
      setInputText("");
    }
  };
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    addSearch(inputText);
    setInputText("");
  };
  const addSearch = (inputText) => {
    if (inputText) {
      setCityName(inputText);
      setInputText("");
    }
  };

  return (
    <div className="App">
      <div className="weather">
        {!loading ? (
          <>
            <form className="form" onSubmit={handleSubmitSearch}>
              <input
                className="input"
                variant="filled"
                placeholder="Введите город"
                error={error}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button className="button1">Найти город</button>
            </form>

            <h1 className="city">{data.name}</h1>
            <div className="group">
              <img
                src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt=""
              />
              <h1>{data.weather[0].main}</h1>
            </div>

            <h1 className="temp">{data.main.temp.toFixed()} °C</h1>

            <Slide direction="right" timeout={800} in={!loading}>
              <div className="box_container">
                <div className="box">
                  <p>Влажность</p>
                  <h1>{data.main.humidity.toFixed()}%</h1>
                </div>

                <div className="box">
                  <p>Ветер</p>
                  <h1>{data.wind.speed.toFixed()} км/ч</h1>
                </div>

                <div className="box">
                  <p>Ощущается как</p>
                  <h1>{data.main.feels_like.toFixed()} °C</h1>
                </div>
              </div>
            </Slide>
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
      <div className="box_container">
        <div className="todo">
          <p>Список задач: {todos.length}</p>
          <ToDoForm addTask={addTask} />
          {todos.map((todo) => {
            return (
              <ToDo
                todo={todo}
                key={todo.id}
                toggleTask={handleToggle}
                removeTask={removeTask}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

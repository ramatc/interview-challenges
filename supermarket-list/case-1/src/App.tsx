import type {Item} from "./types";

import {useEffect, useState} from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  function handleToggle(id: Item["id"]) {
    setItems((items) =>
      items.map((item) => (item.id === id ? {...item, completed: !item.completed} : item)),
    );
  }

  function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault();

    const ids = items.map((item) => item.id);
    const maxId = Math.max(...ids) + 1;

    if (input !== "") {
      setItems([
        ...items,
        {
          id: maxId,
          text: input,
          completed: false,
        },
      ]);
    }

    setInput("");
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    api
      .list()
      .then(setItems)
      .then(() => setLoading(false));
  }, []);

  return (
    <main className={styles.main}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h1>Supermarket list</h1>
          <form onSubmit={handleAdd}>
            <input name="text" type="text" value={input} onChange={handleChange} />
            <button>Add</button>
          </form>
          <ul>
            {items?.map((item) => (
              <li
                key={item.id}
                className={item.completed ? styles.completed : ""}
                onClick={() => handleToggle(item.id)}
              >
                {item.text} <button onClick={() => handleRemove(item.id)}>[X]</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;

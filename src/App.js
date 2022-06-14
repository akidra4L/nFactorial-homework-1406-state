import { useState } from "react";
import { v4 as myNewId } from 'uuid';
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

// local-storage
const myLocalStorage = JSON.parse(localStorage.getItem('items')) || [];

function App() {
  const [itemToDo, setItemToDo] = useState("");
  const [items, setItems] = useState(myLocalStorage);
  // const [items, setItems] = useState([
  //   {
  //     key: 1,
  //     label: "Have fun",
  //   },
  //   {
  //     key: 2,
  //     label: "Spread Empathy",
  //   },
  //   {
  //     key: 3,
  //     label: "Generate Value",
  //   },
  // ]);

  localStorage.setItem("items", JSON.stringify(items));

  const [filterType, setFilterType] = useState("");
  const [searchType, setInputSearch] = useState("");

  const handleFilterChange = ({ type }) => {
    setFilterType(type);
  };

  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  }

  const handleAddItem = () => {
    const newItem = { key: myNewId(), label: itemToDo};

    setItems((prevElement) => [newItem, ...prevElement]);
    setItemToDo("");
  }

  const handleItemDone = ({ key }) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if(item.key == key) {
          return {...item, done: !item.done};
        } else {
          return item;
        }
      })
    })
  };

  const handleItemImportant = ({ key }) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if(item.key == key) {
          return {...item, important: !item.important};
        } else {
          return item;
        }
      })
    })
  }

  const moreToDo = items.filter((item) => !item.done).length;
  const doneToDo = items.length - moreToDo;
  
  const handleRemoveItem = ({ key }) => {
    const newList = items.filter((item) => item.key !== key);
    setItems(newList);
  }

  const handleInputSearch = (event) => {
    setFilterType("search");
    setInputSearch(event.target.value);
  }

  const filteredArray =
    filterType === "all" || !filterType
      ? items
      : filterType === "search"
      ? items.filter((item) => item.label.includes(searchType))
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);
    
  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>{moreToDo} more to do, {doneToDo} done</h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleInputSearch}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button 
              key={item.type} 
              type="button" 
              className={`btn btn-info ${
                filterType === item.type ? "" : "btn-outline-info"
              }`}
              onClick={() => handleFilterChange(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredArray.length > 0 &&
          filteredArray.map((item) => (
          <li key={item.key} className="list-group-item">
            <span className={`todo-list-item ${Boolean(item.done)===true ? "done": ""} ${Boolean(item.important)===true ? "important": ""}`}>
              <span 
                className="todo-list-item-label" 
                onClick={() => handleItemDone(item)}
              >
                {item.label}
              </span>

              <button
                type="button"
                className="btn btn-outline-success btn-sm float-right"
                onClick={() => handleItemImportant(item)}
              >
                <i className="fa fa-exclamation" />
              </button>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm float-right"
                onClick={() => handleRemoveItem(item)}
              >
                <i className="fa fa-trash-o" />
              </button>
            </span>
          </li>
        ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import { fetchItems, addItem as addItemApi } from "./Api";
import NavBar from "./NavBar";
import { Route, Switch } from "react-router-dom";
import Menu from "./Menu";
import Item from "./Item.js";
import slugify from "slugify";
import AddForm from "./AddForm";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState({
    snacks: [],
    drinks: [],
  });

  //Loading backend data

  useEffect(function () {
    async function getAllItems() {
      const snacks = await fetchItems("snacks");
      const drinks = await fetchItems("drinks");
      setMenu({ drinks, snacks });
      setIsLoading(false);
    }
    getAllItems();
  }, []);

  //Call API to add "snacks" or "drinks" items & update state

  async function addItem(type, { name, description, recipe, serve }) {
    let id = slugify(name, { lower: true });
    let objData = { id, name, description, recipe, serve };
    await addItemApi(type, objData);
    setMenu((m) => ({
      ...m,
      [type]: [...m[type], objData],
    }));
  }

  //Render app

  let { snacks, drinks } = menu;

  if (isLoading) {
    return <p>Loading &hellip;</p>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <main>
          <Switch>
            <Route exact path="/">
              <Home snacks={snacks} drinks={drinks} />
            </Route>
            <Route exact path="/snacks">
              <Menu snacks={snacks} title="Snacks" />
            </Route>
            <Route path="/snacks/:id">
              <Item items={snacks} cantFind="/snacks" />
            </Route>
            <Route exact path="/drinks">
              <Menu drinks={drinks} title="Drinks" />
            </Route>
            <Route path="/drinks/:id">
              <Item items={drinks} cantFind="/drinks" />
            </Route>
            <Route path="/add">
              <AddForm addItem={addItem} />
            </Route>
            <Route>
              <p>Hmmm. I can't seem to find what you want.</p>
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";

const jsonData = [
  { id: 1, name: "Root", parent_id: null },
  { id: 2, name: "Child 1", parent_id: 1 },
  { id: 3, name: "Subchild 1.1", parent_id: 2 },
  { id: 4, name: "Subchild 1.2", parent_id: 2 },
  { id: 5, name: "Child 2", parent_id: 1 },
];
let localData = [];
function HierarchyDisplay() {
  //const [filteredData, setFilteredData] = useState([]);
  const [filteredData, setFilteredData] = useState(
    localData.filter((item) => item.ParentId === null)
  );
  const [selectedParent, setSelectedParent] = useState(null);
  const [path, setPath] = useState("");

  const handleInputChange = (event) => {
    setPath(event.target.value);
  };
  useEffect(() => {
    fetch("https://localhost:7087/api/Hierarchy/GetHierarchy")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localData = data;
        console.log(localData);
        const rootItems = data.filter((item) => item.ParentId === -1);
        setFilteredData(rootItems);
      })
      .catch((error) => console.error(error));
  }, []);

  const sendPostRequest = () => {
    const url = `https://localhost:7087/api/Hierarchy/AddHierarchy?path=${path}`;
    console.log(path);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
    };
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Response:", data);
        setPath("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleClick = (itemId) => {
    const newFilteredData = localData.filter(
      (item) => item.ParentId === itemId
    );

    const parent = localData.find((item) => item.Id === itemId);

    if (newFilteredData.length !== 0) {
      setSelectedParent(localData.find((item) => item.Id === itemId));
      setFilteredData([parent, ...newFilteredData]);
    }
  };

  return (
    <div>
      <div>
        <ul>
          {filteredData &&
            filteredData.map((item) => (
              <li
                key={item.Id}
                style={{
                  listStyleType: "none",
                  marginBottom:
                    (selectedParent && item.Id === selectedParent.Id) ||
                    item.ParentId === -1
                      ? "25px"
                      : "5px",
                }}
              >
                <a
                  href="#"
                  onClick={() => handleClick(item.Id)}
                  style={{
                    textDecoration:
                      (selectedParent && item.Id === selectedParent.Id) ||
                      item.ParentId === -1
                        ? "none"
                        : "initial",
                    color:
                      (selectedParent && item.Id === selectedParent.Id) ||
                      item.ParentId === -1
                        ? "green"
                        : "initial",
                    fontSize:
                      (selectedParent && item.Id === selectedParent.Id) ||
                      item.ParentId === -1
                        ? "25px"
                        : "18px",
                  }}
                >
                  {item.Name}
                </a>
              </li>
            ))}
        </ul>
      </div>
      <div style={{ position: "absolute", left: "400px", top: "25px" }}>
        <input
          type="text"
          placeholder="Input Your File's path"
          value={path}
          onChange={handleInputChange}
        ></input>
        <button onClick={sendPostRequest}>Send</button>
      </div>
      <div style={{ position: "absolute", left: "400px", top: "60px" }}>
        This magic input field accepts a folder path like this - D:\\Creating
        Digital Images <br />
        processes on the server and finally sends to the database <br />
        which uses Adjacency list approach for storing hierarchy data.
        <br />
        Then you update the page and see new hierarchy
      </div>
    </div>
  );
}

export default HierarchyDisplay;

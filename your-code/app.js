let treeContainer;
window.addEventListener("DOMContentLoaded", (event) => {
  treeContainer = document.querySelector(".tree-container");
  fetch("http://localhost:3001/api/path/")
    .then((res) => {
      if (!res.ok) {
        throw res;
      } else {
        return res.json();
      }
    })
    .then((res) => {
      const rootNode = new DirectoryTreeNode("root", "directory", "2020-10-09");
      res.forEach((file) => {
        let { name, type, lastModifiedTime } = file;
        rootNode.addChild(new DirectoryTreeNode(name, type, lastModifiedTime));
      });
      updateVisualTree(treeContainer, rootNode);
      document.querySelector(".loading-overlay").style.display = "none";
      console.log(rootNode);
      document.querySelectorAll(".tree-entry__disclosure").forEach((folder) =>
        folder.addEventListener("click", (e) => {
          if (e.target.className.includes("closed")) {
            folder.classList.add("tree-entry__disclosure--opened");
            folder.classList.remove("tree-entry__disclosure--closed");
          } else if (e.target.className.includes("open")) {
            folder.classList.remove("tree-entry__disclosure--opened");
            folder.classList.add("tree-entry__disclosure--closed");
          }
        })
      );
    })
    .catch((e) => {
      const overlay = document.querySelector(".loading-overlay");
      overlay.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
      overlay.innerText = "Error";
    });
});

function updateVisualTree(element, directoryTreeNode) {
  // Create an unordered list to make a UI for the directoryTreeNode
  const ul = document.createElement("ul");
  ul.classList.add("tree");

  // Create a list element for every child of the directoryTreeNode
  for (let child of directoryTreeNode.children) {
    updateVisualTreeEntry(ul, child);
  }

  // Update the tree with the newly created unordered list.
  element.appendChild(ul);
}

function updateVisualTreeEntry(treeElement, child) {
  const li = document.createElement("li");
  li.classList.add("tree-entry");

  // Create a list element with a file icon
  if (child.type === "file") {
    li.innerHTML = `
      <div class="tree-entry__disclosure tree-entry__disclosure--disabled"></div>
      <img class="tree-entry__icon" src="/icons/file_type_${child.getIconTypeName()}.svg">
      <div class="tree-entry__name">${child.name}</div>
      <div class="tree-entry__time">${child.lastModifiedTime}</div>
    `;

    // Or create a list element with a folder icon
  } else if (child.type === "directory") {
    li.innerHTML = `
        <div class="tree-entry__disclosure tree-entry__disclosure--closed"></div>
        <img class="tree-entry__icon" src="/icons/folder_type_${child.getIconTypeName()}.svg">
        <div class="tree-entry__name">${child.name}</div>
        <div class="tree-entry__time">${child.lastModifiedTime}</div>
      `;
  }

  // Add the newly created list element into the unordered list
  treeElement.appendChild(li);
}

class DirectoryTreeNode {
  constructor(name, type, lastModifiedTime) {
    this.name = name;
    this.type = type;
    this.lastModifiedTime = lastModifiedTime;
    this.children = [];
  }
  addChild(child) {
    this.children.push(child);
  }
  getIconTypeName() {
    if (this.type === "directory") {
      return this.name;
    }

    if (this.type === "file") {
      const dotIndex = this.name.lastIndexOf(".");
      if (dotIndex >= 0) {
        return this.name.substring(dotIndex + 1).toLowerCase();
      }
      return this.name;
    }

    return "";
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  fetch("http://localhost:3001/api/path/")
    .then((res) => res.json())
    .then((res) => {
      const { name, type, lastModifiedTime } = res[0];
      const directory = new DirectoryTreeNode(name, type, lastModifiedTime);
      console.log(directory);
    });
});

class DirectoryTreeNode {
  constructor(name, type, lastModifiedTime) {
    this.name = name;
    this.type = type;
    this.lastModifiedTime = lastModifiedTime;
    this.children = [];
  }
}

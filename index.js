import StackedBarChart from "stacked-barchart";

async function init() {
  try {
    const jsonFiles = ['barChart-v2.json', 'barChart-v2-2.json'];

    const { data, data1 } = await getData(jsonFiles)

    // Execute the function to generate a new network
    const graph = StackedBarChart(
      { data },
      {
        containerSelector: "#app"
      }
    );
    
    // To expand the graph upon node click (ie. to see more connections another hop away)
    // The clicked data object can also be used to extract new information
    graph.on('nodeClick', (event) => {
      const node = event.clickedNodeData
      const newNode = data1[node.row][node.key]
      newNode.key = node.key
      newNode.row = node.row
      graph.update(newNode)
    })

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to fetch a JSON file
async function fetchJsonFile(file) {
  try {
      const response = await fetch(file);
      const data = await response.json();
      console.log(`Data from ${file}:`, data);
      return data;
  } catch (error) {
      console.error(`Error fetching ${file}:`, error);
      throw error;
  }
}

// Function to fetch all JSON files concurrently
async function getData(files) {
  try {
      const promises = files.map(file => fetchJsonFile(file));
      const results = await Promise.all(promises);
      console.log('All JSON files fetched:', results);
      return {data: results[0], data1: results[1]}
  } catch (error) {
      console.error('Error fetching JSON files:', error);
  }
}

init()
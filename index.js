const fs = require('fs');

function product() {
  var args = Array.prototype.slice.call(arguments); // makes array from arguments
  return args.reduce(function tl (accumulator, value) {
    var tmp = [];
    accumulator.forEach(function (a0) {
      value.forEach(function (a1) {
        tmp.push(a0.concat(a1));
      });
    });
    return tmp;
  }, [[]]);
}

function getFileContent() {
    const data = fs.readFileSync('./vocabulary.txt');
    return data.toString('utf-8');
}

function* getWords(data) {
    const arr = data.split('\n');
    for (let i = 0;i<arr.length;i++) {
        yield arr[i];
    }
}

function build_graph(words) {
    const buckets = {};
    const graph = {};
    for (let word of words) { 
        for (let i = 0; i<word.length;i++) {
            const first = word.slice(0, i);
            const second = word.slice(i+1);
            const bucket = `${first}_${second}`;
            if (buckets[bucket]) {
                buckets[bucket].push(word);
            } else {
                buckets[bucket] = [word];
            }
        }
    }
    for (let bucket in buckets) {
        const mutual_neighbors = buckets[bucket];
        const productResult = product(mutual_neighbors, mutual_neighbors);
        productResult.forEach(pair => {
           const word1 = pair[0];
           const word2 = pair[1];
           if (word1 !== word2) {
                if (!graph[word1]) {
                    graph[word1] = new Set();
                }
                if (!graph[word2]) {
                    graph[word2] = new Set();
                }
                graph[word1].add(word2);
                graph[word2].add(word1);
           }
        });
    };
    return graph;
}

function* traverse(graph, starting_vertex) {
    const visited = new Set();
    const queue = [[starting_vertex]];
    while (queue.length) {
        const path = queue.shift();
        const vertex = path.slice(-1)[0];
        yield { vertex, path };
        const updatedGraph = new Set([...graph[vertex]].filter(x => !visited.has(x)));
        for (neighbor of updatedGraph) {
            visited.add(neighbor);
            queue.push(path.concat([neighbor]));
        }
    }
}


//USAGE
const word_graph = build_graph(getWords(getFileContent()));

for ({ vertex, path } of traverse(word_graph, 'FOOL')) {
    if (vertex == 'LUCK') {
        console.log(path.join(' -> '));
    }
}
import timeit
from string import ascii_uppercase
from collections import deque, defaultdict

def readfile():
    with open('./vocabulary.txt', 'r') as f:
        content = f.readlines()
        return  [x.strip() for x in content]

def getPermutations(word):
    perm = set()
    for i in range(len(word)):
        for a in ascii_uppercase:
            if word[i] != a:
                perm.add(word[:i] + a + word[i+1:])
    return perm

def buildGraph(words):
    global_set = set(words)
    res = defaultdict(set)
    for w in words:
        permutations = getPermutations(w)
        for p in permutations:
            if p in global_set:
                res[w].add(p)
    return res


def traverse(graph, start):
    visited = set()
    queue = deque([[start]])
    while len(queue):
        path = queue.popleft()
        vertex = path[-1]
        yield vertex, path
        new_graph = graph[vertex]
        for neighbor in new_graph:
            if neighbor in visited:
                continue
            visited.add(neighbor)
            queue.append(path + [neighbor])

words = readfile()

def run():
    graph = buildGraph(words)
    start = 'FOOL'
    end = 'LUCK'

    for vertex, path in traverse(graph, start):
        if vertex == end:
            print(' -> '.join(path))

print(timeit.timeit(run, number=1))
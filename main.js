class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class Tree {
    constructor(arr) {
        this.arr = Sort.MergeSort(arr, true);
        this.root = this.buildTree(this.arr);
    }

    buildTree(arr, currentDepth = 0) {
        if (arr.length === 0) return null;
        
        let mid = Math.floor(arr.length / 2);
        let root = new Node(arr[mid]);
        
        let left = arr.slice(0, mid);
        let right = arr.slice(mid + 1);
        
        root.left = this.buildTree(left);
        root.right = this.buildTree(right);

        // Assign parent
        if (root.left !== null) root.left.parent = root;
        if (root.right !== null) root.right.parent = root;

        return root;
    }

    insert(data, root = this.root) {
        if (data < root.data && root.left !== null) {
            this.insert(data, root.left);
        } else if (data < root.data && root.left === null) {
            root.left = new Node(data);
        };

        if (data > root.data && root.right !== null) {
            this.insert(data, root.right);
        } else if (data > root.data && root.right === null) {
            root.right = new Node(data);
        }

        if (data === root.data) {
            console.log(`A node with the value ${data} already exists.`);
            return;
        } 
    }

    _checkTreeRoot(node) {
        if (node.parent === null) {
            return true;
        } else return false;
    }

    _deleteLeafNode(node, parent = node.parent) {
        if (parent.left === node) parent.left = null;
        if (parent.right === node) parent.right = null;
        if (this._checkTreeRoot(node)) this.root = null;
    }

    _deleteOneChildNode(node, hasLeftChild = true, parent = node.parent) {
        if (node.left !== null && node.right === null) {
            if (parent.left === node) parent.left = node.left;
            if (parent.right === node) parent.right = node.left;
        } else if (node.left === null && node.right !== null) {
            if (parent.left === node) parent.left = node.right;
            if (parent.right === node) parent.right = node.left;
        };
    }

    _deleteTwoChildNode(node) {
        let replacement = node.right; 

        while (replacement.left !== null) {
            replacement = replacement.left;
        }; 

        // replace the next biggest value with their right child; 
        replacement.parent.left = replacement.right;
        // put the replacement in the position of the node; 
        if (this.root === node) {
            this.root = replacement;
        } else {
            if (node.parent.left === node) node.parent.left = replacement;
            if (node.parent.right === node) node.parent.right = replacement;
        }
        // assign node's children to the replacement; 
        replacement.left = node.left; 
        replacement.right = node.right;

    }

    delete(data, root = this.root) {

        if (data === root.data) {
            let parent;
            if (root.parent !== null) parent = root.parent;

            // dataNode is a leaf
            if (root.left === null && root.right === null) this._deleteLeafNode(root);

            // dataNode has one child
            if (root.left === null || root.right === null) this._deleteOneChildNode(root);

            // dataNode has two children
            if (root.left !== null && root.right !== null) this._deleteTwoChildNode(root);

        };
        
        if (data < root.data && root.left !== null) {
            this.delete(data, root.left);
        } else if (data < root.data && root.left === null) {
            console.log(`A node with the value ${data} was not found.`);
            return;
        };

        if (data > root.data && root.right !== null) {
            this.delete(data, root.right);
        } else if (data > root.data && root.right === null) {
            console.log(`A node with the value ${data} was not found.`);
            return;
        };

    }
}


class Sort {
    static MergeSort(arr, removeDuplicates = false) {
        if (arr.length < 2) {
            return arr; 
        }

        const mid = Math.floor(arr.length / 2);
        const leftArr = arr.slice(0, mid);
        const rightArr = arr.slice(mid);

        if (removeDuplicates) {
            return this._mergeNoDuplicates(this.MergeSort(leftArr), this.MergeSort(rightArr));
        } else {
            return this._merge(this.MergeSort(leftArr), this.MergeSort(rightArr));
        };
    }

    static _merge(left, right) {
        const sortedArr = [];

        while (left.length && right.length) {
            if (left[0] <= right[0]) {
                sortedArr.push(left.shift());
            } else {
                sortedArr.push(right.shift());
            }
        };

        return [...sortedArr, ...left, ...right];
    }

    static _mergeNoDuplicates(left, right) {
        const sortedArr = [];
        let lastAdded = null;

        while (left.length && right.length) {
            let candidate;

            if (left[0] < right[0]) {
                candidate = left.shift();
            } else if (left[0] > right[0]) {
                candidate = right.shift();
            } else {
                candidate = left.shift();
                right.shift();
            };

            if (candidate !== lastAdded) {
                sortedArr.push(candidate);
                lastAdded = candidate;
            }

        };

        const remaining = [...left, ...right];

        for (let val of remaining) {
            if (val !== lastAdded) {
                sortedArr.push(val);
                lastAdded = val;
            }
        };

        return sortedArr;

    }
}


let testArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let sortedTestArr = Sort.MergeSort(testArray, true);
console.log(sortedTestArr);

let t = new Tree(testArray);
t.insert(400);
prettyPrint(t.root);
t.delete(8);
prettyPrint(t.root);



function prettyPrint(node, prefix = '', isLeft = true) {
    if (node === null) {
    return;
    }
    if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
};
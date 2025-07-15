class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.parent = null;
    }

    empty() {
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
            root.left.parent = root;
        }

        if (data > root.data && root.right !== null) {
            this.insert(data, root.right);
        } else if (data > root.data && root.right === null) {
            root.right = new Node(data);
            root.right.parent = root;
        }

        if (data === root.data) {
            console.log(`A node with the value ${data} already exists.`);
            return;
        }
    }

    _transplant(newNode, oldNode, emptyOldNode = true, keepChildren = true) {
        if (oldNode === null) throw new Error("Nodes must not be null");

        if (oldNode === this.root) {
            this.root = newNode;
            if (newNode !== null) newNode.parent = null;
        } else {
            if (newNode !== null) newNode.parent = oldNode.parent;

            if (oldNode.parent.left === oldNode) {
                oldNode.parent.left = newNode;
            } else if (oldNode.parent.right === oldNode) {
                oldNode.parent.right = newNode;
            }
        }

        if (!keepChildren && newNode !== null) {
            newNode.left = oldNode.left;
            if (newNode.left) newNode.left.parent = newNode;

            newNode.right = oldNode.right;
            if (newNode.right) newNode.right.parent = newNode;
        }

        if (emptyOldNode) oldNode.empty();
    }

    _deleteLeafNode(node) {
        if (node.parent.left === node) {
            node.parent.left = null;
            node.left = null;
            node.right = null;
            node.parent = null;
            return;
        } else if (node.parent.right === node) {
            node.parent.right = null;
            node.left = null;
            node.right = null;
            node.parent = null;
        }
    }

    _deleteNodeOneChild(node) {
        if (node.left !== null && node.right === null) {
            this._transplant(node.left, node);
            return;
        } else if (node.left === null && node.right !== null) {
            this._transplant(node.right, node);
            return;
        }
    }

    _deleteNodeTwoChild(node) {
        let replacement = node.right;

        while (replacement.left !== null) {
            replacement = replacement.left;
        }

        if (replacement.parent !== node) {
            this._transplant(replacement.right, replacement);
            replacement.right = node.right;
            if (replacement.right) replacement.right.parent = replacement;
        }

        this._transplant(replacement, node, false);

        replacement.left = node.left;
        if (replacement.left) replacement.left.parent = replacement;
    }

    _deleteRoot() {
        let root = this.root;

        if (root.left === null && root.right === null) {
            this.root = null;
            return;
        }

        if (root.left !== null && root.right !== null) {
            this._deleteNodeTwoChild(root);
            return;
        }

        this._deleteNodeOneChild(root);
    }

    delete(data, targetNode = this.root) {
        if (targetNode === null) return;

        if (data === targetNode.data) {
            // break case

            if (targetNode === this.root) {
                this._deleteRoot();
                return;
            } else if (targetNode.left === null && targetNode.right === null) {
                // leaf node case
                this._deleteLeafNode(targetNode);
                return;
            } else if (targetNode.left === null || targetNode.right === null) {
                // node with one child case
                this._deleteNodeOneChild(targetNode);
                return;
            } else if (targetNode.left !== null && targetNode.right !== null) {
                // node with two children case
                this._deleteNodeTwoChild(targetNode);
                return;
            } else {
                throw new Error("Data found inside the tree, but something went wrong");
            }
        }

        if (data < targetNode.data && targetNode.left !== null) {
            this.delete(data, targetNode.left);
            return;
        } else if (data < targetNode.data && targetNode.left === null) {
            throw new Error("Value was not found inside the tree.");
        }

        if (data > targetNode.data && targetNode.right !== null) {
            this.delete(data, targetNode.right);
            return;
        } else if (data > targetNode.data && targetNode.right === null) {
            throw new Error("Value was not found inside the tree.");
        }
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
            return this._mergeNoDuplicates(
                this.MergeSort(leftArr),
                this.MergeSort(rightArr)
            );
        } else {
            return this._merge(this.MergeSort(leftArr), this.MergeSort(rightArr));
        }
    }

    static _merge(left, right) {
        const sortedArr = [];

        while (left.length && right.length) {
            if (left[0] <= right[0]) {
                sortedArr.push(left.shift());
            } else {
                sortedArr.push(right.shift());
            }
        }

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
            }

            if (candidate !== lastAdded) {
                sortedArr.push(candidate);
                lastAdded = candidate;
            }
        }

        const remaining = [...left, ...right];

        for (let val of remaining) {
            if (val !== lastAdded) {
                sortedArr.push(val);
                lastAdded = val;
            }
        }

        return sortedArr;
    }
};

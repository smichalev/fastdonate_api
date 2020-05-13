const arr = [
	{
		id: 1,
		child: [
			{
				id: 2,
				child: [],
			},
			{
				id: 3,
				child: [],
			},
		],
	}
];

function add(arr, id, value) {
	for (let i = 0; i < arr.length; i++) {
		let finded = false;
		
		if (arr[i].id === id) {
			finded = true;
			arr[i].child.push(value);
		}
		
		if (arr[i].child.length && !finded) {
			add(arr[i].child, id, value);
		}
	}
}

console.log(JSON.stringify(arr));
add(arr, 1, {id: 777, child: []});
console.log(JSON.stringify(arr));

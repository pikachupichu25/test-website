var toJson = function(obj){ return obj.json(); };
var elems = fetch("./simple_graph.json").then(toJson);

var cy = window.cy = cytoscape({
	container: document.getElementById('cy'),

	style: [
		{
			selector: 'node',
			style: {
				'content': 'data(id)'
			}
		},

		{
			selector: 'edge',
			style: {
				'curve-style': 'bezier',
				'target-arrow-shape': 'triangle'
			}
		}
	],

	elements: elems,

	layout: {
		name: 'grid'
	}
});

// var a = cy.getElementById('a');
// var b = cy.getElementById('b');
// var ab = cy.getElementById('ab');

// make the tippy from graph ele
var shortText
var makeTippy = function(ele, text){
	var ref = ele.popperRef();

	// Since tippy constructor requires DOM element/elements, create a placeholder
	var dummyDomEle = document.createElement('div');

	var tip = tippy( dummyDomEle, {
		getReferenceClientRect: ref.getBoundingClientRect,
		trigger: 'manual', // mandatory
		// dom element inside the tippy:
		content: function(){ // function can be better for performance
			shortText = document.createElement('div');
			shortText.innerHTML = text;
			return shortText;
		},
		// your own preferences:
		arrow: true,
		placement: 'bottom',
		hideOnClick: false,
		sticky: "reference",

		// if interactive:
		interactive: true,
		appendTo: document.body // or append dummyDomEle to document.body
	} );

	return tip;
};

// make tippy from any target
var makeNestedTippy = function(target, text){
	var nestedtip = tippy(target, {
		content: function(){
			var div = document.createElement('div');
			div.innerHTML = text;
			return div;
		},
		trigger: 'click',
		placement: 'bottom'
	});
	return nestedtip;
}

 
// create tippy for every node
var tippy_obj = [] 
var nested_tippy_obj = []
for (var i = 0; i < cy.nodes().size(); i++){
	var node = cy.nodes()[i];
	var tip = makeTippy(node, node.data('summary'));
	tippy_obj[node.id()] = tip;
	var nestedtip = makeNestedTippy(shortText, node.data('full_text'));
}

cy.on('tap', 'node', function(evt){
	var node = this;
	if (tippy_obj[node.id()].state.isShown){
		// console.log('hide');
		// tippy_obj[node.id()] = makeTippy(node, 'expect');
		// var tippy = tippy_obj[node.id()];
		tippy_obj[node.id()].hide();
	} else {
		// console.log('show');
		// var tippy = tippy_obj[node.id()];
		tippy_obj[node.id()].show()
	}

	
});

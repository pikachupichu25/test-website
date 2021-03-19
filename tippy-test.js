// var elems = {
// 		nodes: [
// 			{ data: { 
// 				id: 'a', 
// 				summary: 'This is Node A summary.',
// 				full_text: 'This is a long text. This is a long text. This is a long text. This is a long text. This is a long text.'
// 			} },
// 			{ data: { 
// 				id: 'b', 
// 				summary: 'This is Node B summary.',
// 				full_text: 'This is a long text. This is a long text. This is a long text. This is a long text. This is a long text.'
// 			} }
// 		],
// 		edges: [
// 			{ data: { id: 'ab', source: 'a', target: 'b' } }
// 		]
// 	}

var tippy_obj = [] 
var nested_tippy_obj = []
var shortText
var cy
// function make the tippy from graph ele
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

// function make tippy from any target
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
/////


var toJson = function(obj){ return obj.json(); };
var graphP = fetch('tippy-test-graph.json').then(toJson);
Promise.all([ graphP]).then(initCy);

function initCy(then){
	var elems = then[0]
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
				'target-arrow-shape': 'triangle',
				'content': 'data(id)'
			}
		}
	],

	elements: elems,
	layout: {
		name: 'grid'
	}
	});

	// create tippy for every node
	
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
		// add condition: center if the node is at the margin
		// cy.center(node)
	});

}




